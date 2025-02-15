export default {
  name: "Browser",
  description: "Search the internet.",
  ver: 1, // Compatible with core v1
  type: "process",
  exec: async function (Root) {
    let wrapper; // Lib.html | undefined
    let MyWindow;

    console.log("Hello from example package", Root.Lib);

    function onEnd() {
      console.log("Example process ended, attempting clean up...");
      const result = Root.Lib.cleanup(Root.PID, Root.Token);
      if (result === true) {
        MyWindow.close();
        console.log("Cleanup Success! Token:", Root.Token);
      } else {
        console.log("Cleanup Failure. Token:", Root.Token);
      }
    }

    const Win = (await Root.Lib.loadLibrary("WindowSystem")).win;

    // Testing the html library
    MyWindow = new Win({
      title: "Browser",
      content: "",
      pid: Root.PID,
      onclose: () => {
        onEnd();
      },
    });

    wrapper = MyWindow.window.querySelector(".win-content");
    wrapper.classList.add('col', 'with-sidebar');

    const header = new Root.Lib.html("div")
      .style({
        display: "flex",
        "flex-direction": "row",
        gap: "8px",
        "justify-content": "space-between",
      })
      .appendTo(wrapper);

    const iframe = new Root.Lib.html("iframe")
      .attr({
        // there's a good reason i did this, it's called browser compatiblity
        style:
          "width:-webkit-fill-available;width:-moz-fill-available;height:-webkit-fill-available;height:-moz-fill-available;",
        src: "http://frogfind.com/",
      })
      .class('fg')
      .appendTo(wrapper);

    new Root.Lib.html("input")
      .attr({
        type: "search",
        // there's a good reason i did this, it's called browser compatiblity
        style: "width:-webkit-fill-available;width:-moz-fill-available;",
        value: "http://frogfind.com/",
      })
      .on("search", async (e) => {
        if (e.target.value.trim() == "") return;
        iframe.attr({ src: e.target.value.trim() });
      })
      .appendTo(header);

    new Root.Lib.html("button")
      .style({
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        padding: "8px",
      })
      .html(
        `<svg viewBox="0 0 24 24" width="12" height="12" stroke="var(--text)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="ignore-css"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`
      )
      .on("click", () => {
        iframe.elm.contentWindow.location.reload();
      })
      .appendTo(header);

    return Root.Lib.setupReturns(onEnd, (m) => {
      console.log("Example recieved message: " + m);
    });
  },
};
