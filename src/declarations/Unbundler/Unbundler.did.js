export const idlFactory = ({ IDL }) => {
  const Property = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const Item = IDL.Record({
    'id' : IDL.Nat64,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'properties' : IDL.Vec(Property),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Unbundler = IDL.Service({
    'data_of' : IDL.Func([IDL.Nat64], [Item], ['query']),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'owner_of' : IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Principal)], ['query']),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer_to' : IDL.Func([IDL.Principal, IDL.Nat64], [IDL.Bool], []),
    'unbundle' : IDL.Func([IDL.Nat64], [Result], []),
    'user_tokens' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Nat64)], ['query']),
  });
  return Unbundler;
};
export const init = ({ IDL }) => { return []; };
