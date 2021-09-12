# drip-unbundler

Unbundle your [IC Drip](http://icdrip.io/) into individual items.

[Canister mx7fv-viaaa-aaaah-aarsa-cai](https://ic.rocks/principal/mx7fv-viaaa-aaaah-aarsa-cai)

This token interface is similar to [ICPunks](https://github.com/stopak/ICPunks/blob/dev/service/icpunks_rust.did) and [EXT](https://github.com/Toniq-Labs/extendable-token), but with batch queries and notifications. It's slightly different from the original IC Drip interface.

## Types

### Items

```
type Property =
 record {
   name: text;
   value: variant {
            Bool: bool;
            Int: int64;
            Text: text;
          };
 };
type Item =
 record {
   id: nat64;
   name: text;
   owner: principal;
   properties: vec Property;
 };
```

## Usage

### Unbundle

Call `drip.transfer_with_notify("mx7fv-viaaa-aaaah-aarsa-cai", token_id)`.

This will burn the callers' Drip by transferring ownership to `aaaaa-aa`. For each constituent, mint a new `Item` containing properties:

```
Property { name = "slot"; value = "..." }
Property { name = "name"; value = "..." }
Property { name = "prefix"; value = "..." }
Property { name = "name_prefix"; value = "..." }
Property { name = "name_suffix"; value = "..." }
Property { name = "special"; value = "..." }
```

### Transfer

```
transfer_to: (principal, nat64, opt bool) -> (bool);
```

Transfers `Item` by id, optionally notifying the receiver.

## Queries

```
name: () -> (text) query;
symbol: () -> (text) query;
total_supply: () -> (nat) query;
drips_burned_count: () -> (nat) query;

owner_of: (vec nat64) -> (vec principal) query;
data_of: (vec nat64) -> (vec Item) query;

user_tokens: (opt principal) -> (vec nat64) query;
```
