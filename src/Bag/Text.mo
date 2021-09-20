import Array "mo:base/Array";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";

module {
  public func textFromVec(xs: [Nat8]): Text {
    let chars = Iter.fromArray(Array.map<Nat8, Char>(xs, func(x) {
      Char.fromNat32(Nat32.fromNat(Nat8.toNat(x)))
    }));
    Text.fromIter(chars)
  }
}
