import { unbundler } from "../../declarations/unbundler";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with unbundler actor, calling the greet method
  const greeting = await unbundler.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
