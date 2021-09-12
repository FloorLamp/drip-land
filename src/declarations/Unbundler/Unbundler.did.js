export const idlFactory = ({ IDL }) => {
  const Property = IDL.Record({
    'value' : IDL.Variant({
      'Int' : IDL.Int64,
      'Bool' : IDL.Bool,
      'Text' : IDL.Text,
    }),
    'name' : IDL.Text,
  });
  const Item = IDL.Record({
    'id' : IDL.Nat64,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'properties' : IDL.Vec(Property),
  });
  const TransferNotification = IDL.Record({
    'to' : IDL.Principal,
    'token_id' : IDL.Nat64,
    'from' : IDL.Principal,
    'amount' : IDL.Nat64,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Unbundler = IDL.Service({
    'data_of' : IDL.Func([IDL.Vec(IDL.Nat64)], [IDL.Vec(Item)], ['query']),
    'drips_burned_count' : IDL.Func([], [IDL.Nat], ['query']),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'owner_of' : IDL.Func(
        [IDL.Vec(IDL.Nat64)],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer_notification' : IDL.Func([TransferNotification], [Result], []),
    'transfer_to' : IDL.Func(
        [IDL.Principal, IDL.Nat64, IDL.Opt(IDL.Bool)],
        [IDL.Bool],
        [],
      ),
    'user_tokens' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Vec(IDL.Nat64)],
        ['query'],
      ),
  });
  return Unbundler;
};
export const init = ({ IDL }) => { return []; };
