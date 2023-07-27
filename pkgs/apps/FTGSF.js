export default {
  name: "FTGSF",
  description: "Generates shortcuts for applications on the Desktop.",
  ver: 1, // Compatible with core v1
  type: "process",
  exec: async function (Root) {
    let wrapper; // Lib.html | undefined\

    function onEnd() {
      console.log("Example process ended, attempting clean up...");
      const result = Root.Lib.cleanup(Root.PID, Root.Token);
      if (result === true) {
        console.log("Cleanup Success! Token:", Root.Token);
      }
    }

    console.log("generating shortcuts for applications on the desktop");

    const vfs = await Root.Lib.loadLibrary("VirtualFS");
    await vfs.importFS();

    // task manager
    // file manager
    // image viewer
    // notepad
    // weather
    // DevEnv

    let shortcutsList = [
      { name: "Task Manager", icon: "cpu", fullName: "apps:TaskManager" },
      { name: "File Manager", icon: "folders", fullName: "apps:FileManager" },
      { name: "Image Viewer", icon: "image", fullName: "apps:ImageViewer" },
      { name: "Notepad", icon: "note", fullName: "apps:Notepad" },
      // { name: "Weather", icon: "cloudMoon", fullName: "apps:Weather" },
      { name: "DevEnv", icon: "fileCode", fullName: "apps:DevEnv" },
      // { name: "Browser", icon: "globe", fullName: "apps:Browser" },
      { name: "Settings", icon: "wrench", fullName: "apps:Settings" },
      { name: "Terminal", icon: "terminal", fullName: "apps:Terminal" },
    ];
    console.log(shortcutsList.length);
    for (let i = 0; i < shortcutsList.length; i++) {
      await vfs.writeFile(
        "Root/Desktop/" + shortcutsList[i].name.replace(" ", "") + ".shrt",
        JSON.stringify(shortcutsList[i])
      );
    }
    onEnd();

    return Root.Lib.setupReturns(onEnd, (m) => {
      console.log("Example received message: " + m);
    });
  },
};
