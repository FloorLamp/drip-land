export const idlFactory = ({ IDL }) => {
  const BundleRequest = IDL.Record({
    'ids' : IDL.Vec(IDL.Nat32),
    'name' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat32, 'err' : IDL.Text });
  const Property = IDL.Record({
    'value' : IDL.Variant({
      'Int' : IDL.Int64,
      'Bool' : IDL.Bool,
      'Text' : IDL.Text,
    }),
    'name' : IDL.Text,
  });
  const Item = IDL.Record({
    'id' : IDL.Nat32,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'properties' : IDL.Vec(Property),
    'childOf' : IDL.Opt(IDL.Nat32),
    'children' : IDL.Vec(IDL.Nat32),
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackHttpResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : IDL.Func(
          [StreamingCallbackToken],
          [StreamingCallbackHttpResponse],
          ['query'],
        ),
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const TransferNotification = IDL.Record({
    'to' : IDL.Principal,
    'token_id' : IDL.Nat64,
    'from' : IDL.Principal,
    'amount' : IDL.Nat64,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Vec(IDL.Nat32), 'err' : IDL.Text });
  const Bag = IDL.Service({
    'bundle' : IDL.Func([BundleRequest], [Result_2], []),
    'data_of' : IDL.Func(
        [IDL.Vec(IDL.Nat32)],
        [IDL.Vec(IDL.Opt(Item))],
        ['query'],
      ),
    'drips_burned_count' : IDL.Func([], [IDL.Nat], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'owner_of' : IDL.Func(
        [IDL.Vec(IDL.Nat32)],
        [IDL.Vec(IDL.Opt(IDL.Principal))],
        ['query'],
      ),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer_notification' : IDL.Func([TransferNotification], [Result_1], []),
    'transfer_to' : IDL.Func(
        [IDL.Principal, IDL.Nat32, IDL.Opt(IDL.Bool)],
        [Result_1],
        [],
      ),
    'unbundle' : IDL.Func([IDL.Nat32], [Result], []),
    'user_tokens' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Vec(IDL.Nat32)],
        ['query'],
      ),
  });
  return Bag;
};
export const init = ({ IDL }) => { return []; };
