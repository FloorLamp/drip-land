# drip-unbundler

Unbundle your [IC Drip](http://icdrip.io/) into individual items.

## Types

### Items

```
type Property =
 record {
   name: text;
   value: text;
 };
type Item =
 record {
   id: nat64;
   name: text;
   owner: principal;
   properties: vec Property;
 };
```

## Updates

### `unbundle: (nat64) -> (Result);`

Burns the Drip (owned by caller) by transferring ownership to `aaaaa-aa`. For each item, mint a new `Item` containing `Property { name = "slot"; name = "..." }`.

### `transfer_to: (principal, nat64) -> (bool);`

Transfer `Item` by id.

## Queries

```
data_of: (nat64) -> (Item) query;
name: () -> (text) query;
owner_of: (nat64) -> (opt principal) query;
symbol: () -> (text) query;
total_supply: () -> (nat) query;
user_tokens: (principal) -> (vec nat64) query;
```

Similar to the [ICPunks](https://github.com/stopak/ICPunks/blob/dev/service/icpunks_rust.did) interface, this is simple and lightweight.
