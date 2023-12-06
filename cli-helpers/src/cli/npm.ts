import { defineCliExecutable } from "cli-specs";
import { outdent } from "outdent";
import which from "which";

export const npm = defineCliExecutable({
  executableName: "npm",
  executablePath: async () => which("npm"),
  description: outdent`
		npm
	`,
  defaultExecaOptions: {
    stdout: "inherit",
    stderr: "inherit",
  },
});
