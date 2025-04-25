import protobuf from "protobufjs";

let rootPromise = null;

const REMOTE_ASSET_PROTO_URL =
  "https://raw.githubusercontent.com/bazelbuild/remote-apis/main/build/bazel/remote/asset/v1/remote_asset.proto";
const GOOGLE_RPC_PROTO_URL =
  "https://raw.githubusercontent.com/bazelbuild/remote-apis/main/google/rpc/status.proto";

async function fetchProto(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch proto: ${url}`);
  return res.text();
}

export async function loadProtos() {
  if (!rootPromise) {
    rootPromise = (async () => {
      const [remoteAssetProto, statusProto] = await Promise.all([
        fetchProto(REMOTE_ASSET_PROTO_URL),
        fetchProto(GOOGLE_RPC_PROTO_URL),
      ]);

      const root = protobuf.Root.fromJSON({ nested: {} });

      // Load dependencies first
      protobuf.parse(statusProto, root, { keepCase: true });
      protobuf.parse(remoteAssetProto, root, { keepCase: true });

      return root;
    })();
  }

  return rootPromise;
}

export async function decode(messageType, buffer) {
  const root = await loadProtos();
  const Type = root.lookupType(messageType);
  return Type.decode(buffer);
}

export async function encode(messageType, obj) {
  const root = await loadProtos();
  const Type = root.lookupType(messageType);
  return Type.encode(Type.fromObject(obj)).finish();
}
