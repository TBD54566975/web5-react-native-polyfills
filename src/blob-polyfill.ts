import { getArrayBufferForBlob } from 'react-native-blob-jsi-helper';
import { ReadableStream } from 'web-streams-polyfill';

const decoder = new TextDecoder();

/**
 * React Native's Blob implementation has a constructor that currently only supports
 * constructing from parts that are of type: Array<Blob | String>.
 *
 * Web5 packages need to be able to construct a Blob where one of the parts is of type `Uint8Array`.
 *
 * This function updates the constructor of Blob to convert any parts that are of type `Uint8Array`
 * into a `string`, so that it can properly work with React Native's Blob implementation.
 */
function monkeyPatchBlobConstructor() {
  const OriginalBlob = global.Blob;

  const blobProxyHandler = {
    construct(target: any, argumentsList: any) {
      const blobParts = argumentsList[0];
      const options = argumentsList[1];

      if (blobParts) {
        // TODO #64: Investigate performance here, and see if we can make an upstream change to fix.
        for (let i = 0; i < blobParts.length; i++) {
          if (blobParts[i] instanceof Uint8Array) {
            // Decode and replace in place if the element is a Uint8Array
            blobParts[i] = decoder.decode(blobParts[i]);
          }
        }
      }

      return new target(blobParts, options);
    },
  };

  const blobProxy = new Proxy(OriginalBlob, blobProxyHandler);
  global.Blob = blobProxy;
}

/**
 * React Native's Blob implementation currently does provide a `stream()` function.
 *
 * Web5 packages depend on this function for a multitude of functionality.
 *
 * This function provides a polyfill for this function if it does not exist.
 */
function polyfillBlobStream() {
  if (!Blob.prototype.stream) {
    Blob.prototype.stream = function (): ReadableStream<Uint8Array> {
      const blob = this;

      return new ReadableStream({
        async start(controller) {
          const arrayBuffer = await getArrayBuffer(blob);
          controller.enqueue(arrayBuffer);
          controller.close();
        },
      });
    };
  }
}

/**
 * Patches bug caused by calling getArrayBufferForBlob() right after constructing a new Blob()`.
 *
 * In React Native, Blobs are created via NativeBlobModule. Despite the API to
 * create Blobs being synchronous, the actual bytes backing the Blob may not be
 * available immmediately.
 *
 * This function looks for the backing arrayBuffer for a Blob, with small microsleeps
 * until it is ultimately available via the JSI.
 */
async function getArrayBuffer(blob: Blob): Promise<Uint8Array> {
  let arrayBuffer: Uint8Array | undefined = undefined;
  try {
    arrayBuffer = getArrayBufferForBlob(blob);
  } catch {}

  if (arrayBuffer && arrayBuffer.length === blob.size) {
    return arrayBuffer;
  } else {
    // The buffer isn't available yet from the JSI.
    // Microsleep to advance to the next runloop, and try again.
    await sleep(1);
    return getArrayBuffer(blob);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function polyfillBlob() {
  monkeyPatchBlobConstructor();
  polyfillBlobStream();
}
