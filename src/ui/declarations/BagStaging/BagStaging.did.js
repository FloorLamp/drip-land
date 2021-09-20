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
  const ItemState = IDL.Variant({ 'equipped' : IDL.Null });
  const Item = IDL.Record({
    'id' : IDL.Nat32,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'properties' : IDL.Vec(Property),
    'childOf' : IDL.Opt(IDL.Nat32),
    'children' : IDL.Vec(IDL.Nat32),
    'state' : IDL.Opt(ItemState),
    'dripProperties' : IDL.Opt(
      IDL.Record({ 'id' : IDL.Nat32, 'isBurned' : IDL.Bool })
    ),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
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
  const PlayerStatus = IDL.Record({});
  const PlayerData = IDL.Record({
    'status' : IDL.Vec(PlayerStatus),
    'inventory' : IDL.Vec(IDL.Nat32),
    'name' : IDL.Text,
    'equipped' : IDL.Variant({
      'items' : IDL.Record({
        'accessory' : IDL.Opt(IDL.Nat32),
        'foot' : IDL.Opt(IDL.Nat32),
        'hand' : IDL.Opt(IDL.Nat32),
        'head' : IDL.Opt(IDL.Nat32),
        'chest' : IDL.Opt(IDL.Nat32),
        'underwear' : IDL.Opt(IDL.Nat32),
        'pants' : IDL.Opt(IDL.Nat32),
        'waist' : IDL.Opt(IDL.Nat32),
      }),
      'bundle' : IDL.Opt(IDL.Nat32),
    }),
  });
  const TransferNotification = IDL.Record({
    'to' : IDL.Principal,
    'token_id' : IDL.Nat64,
    'from' : IDL.Principal,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'amount' : IDL.Nat64,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Nat32), 'err' : IDL.Text });
  const Bag = IDL.Service({
    'bundle' : IDL.Func([BundleRequest], [Result_2], []),
    'dataOf' : IDL.Func(
        [IDL.Vec(IDL.Nat32)],
        [IDL.Vec(IDL.Opt(Item))],
        ['query'],
      ),
    'dripsBurnedCount' : IDL.Func([], [IDL.Nat], ['query']),
    'equip' : IDL.Func([IDL.Vec(IDL.Nat32)], [Result], []),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'ownerOf' : IDL.Func(
        [IDL.Vec(IDL.Nat32)],
        [IDL.Vec(IDL.Opt(IDL.Principal))],
        ['query'],
      ),
    'playerData' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Opt(PlayerData)],
        ['query'],
      ),
    'reclaim' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Vec(IDL.Nat32)], []),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'transferTo' : IDL.Func(
        [IDL.Principal, IDL.Nat32, IDL.Opt(IDL.Bool)],
        [Result],
        [],
      ),
    'transfer_notification' : IDL.Func([TransferNotification], [Result], []),
    'unbundle' : IDL.Func([IDL.Nat32], [Result_1], []),
    'unequip' : IDL.Func([IDL.Vec(IDL.Nat32)], [Result], []),
    'userTokens' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Vec(IDL.Nat32)],
        ['query'],
      ),
  });
  return Bag;
};
export const init = ({ IDL }) => { return []; };
