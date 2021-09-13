import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Int64 "mo:base/Int64";
import Nat "mo:base/Nat";
import T "./Types";

module {
  func propertyValue({value}: T.Property): Text {
    switch (value) {
      case (#Text(v)) { v };
      case (#Bool(v)) { Bool.toText(v) };
      case (#Int(v)) { Int64.toText(v) };
    }
  };

  public func itemName(item: T.Item): Text {
    var slot = "";
    var name = "";
    var prefix = "";
    var name_prefix = "";
    var name_suffix = "";
    var special = "";
    for (prop in item.properties.vals()) {
      switch (prop.name, prop.value) {
        case ("slot", #Text(t)) { if (t != "") { slot := "[" # t # "] " } };
        case ("prefix", #Text(t)) { if (t != "") { prefix := t # " " } };
        case ("name_prefix", #Text(t)) { if (t != "") { name_prefix := "\"" # t # "\" " } };
        case ("name_suffix", #Text(t)) { if (t != "") { name_suffix := " (" # t # ")" } };
        case ("special", #Bool(true)) { special :=  "🔥" };
        case _ {};
      }
    };
    let children = if (item.children.size() > 0) { " (" # Nat.toText(item.children.size()) # " items)" } else "";
    slot # name_prefix # prefix # item.name # children # name_suffix # special
  };

  public func renderItemWithChildren(item: T.Item, items: [T.Item]): Text {
    var y = 30;
    "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 420 " # Nat.toText(30 + (items.size() + 1) * 20) # "'> <style> .base { fill: white; font-family: HelveticaNeue-Bold, Helvetica Neue; font-size: 14px; } </style> <rect width='100%' height='100%'/>" #
    "<text x='10' y='20' class='base'>" # itemName(item) # "</text>" #
    Array.foldLeft<T.Item, Text>(items, "", func (ts, c) {
      y += 20;
      ts # "<text x='10' y='" # Nat.toText(y) # "' class='base'>" # itemName(c) # "</text>"
    }) # "</svg>"
  }
}
