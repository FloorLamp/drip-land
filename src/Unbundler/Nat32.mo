import ArrayHelper "./Array";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";

module {
  public func contains(arr: [Nat32], a: Nat32) : Bool {
    ArrayHelper.contains<Nat32>(arr, a, Nat32.equal)
  };

  public func fromText(text : Text) : Nat32 {
    assert(text.size() > 0);
    let chars = text.chars();

    var num : Nat32 = 0;
    for (v in chars) {
      let charToNum = Char.toNat32(v) - 48;
      assert(charToNum >= 0 and charToNum <= 9);
      num := num * 10 +  charToNum;
    };

    num;
  };

  public func id(a: Nat32): Nat32 { a };
}
