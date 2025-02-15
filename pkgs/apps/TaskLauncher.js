export default {
  name: "Task Launcher",
  description:
    "Launch applications with any kind of elevation. Pop-ups will be displayed showing what kind of will be used.",
  ver: 1, // Compatible with core v1
  type: "process",
  exec: async function (Root) {
    let wrapper;
    let MyWindow;

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
      title: "Task Launcher",
      content: "",
      width: 350,
      height: 90,
      resizable: false,
      pid: Root.PID,
      onclose: () => {
        onEnd();
      },
    });
    wrapper = MyWindow.window.querySelector(".win-content");

    wrapper.classList.add("row");

    /* Paragraph */
    let x = new Root.Lib.html("input")
      .attr({ placeholder: "App ID (apps:...)" })
      .class("fg")
      .appendTo(wrapper);
    /* Button */
    new Root.Lib.html("button")
      .text("Launch")
      .appendTo(wrapper)
      .on("click", (e) => {
        Root.Lib.launch("apps:" + x.elm.value.replace(/([^A-Za-z0-9-])/g, ""));
      });

    return Root.Lib.setupReturns(onEnd, (m) => {
      console.log("Example recieved message: " + m);
    });
  },
};
