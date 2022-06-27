import { useCallback } from "react";
import { useAtom } from "jotai";

import {
  buildCountAtom,
  explorerAtom,
  terminalOutputAtom,
  terminalStateAtom,
} from "../../../../state";
import { PgBuild, PgTerminal } from "../../../../utils/pg";

// Run terminal commands
const useCmd = () => {
  const [explorer] = useAtom(explorerAtom);
  const [, setTerminal] = useAtom(terminalOutputAtom);
  const [, setBuildCount] = useAtom(buildCountAtom);
  const [terminalState, setTerminalState] = useAtom(terminalStateAtom);

  const runBuild = useCallback(async () => {
    if (!explorer) return;

    let msg = PgTerminal.info("Building...");
    setTerminal(msg);

    try {
      const result = await PgBuild.build(explorer.getBuildFiles());

      msg = PgTerminal.editStderr(result.stderr, result.uuid);

      // To update programId each build
      setBuildCount((c) => c + 1);
    } catch (e: any) {
      msg = `${PgTerminal.error("Build error:")} ${e.message}\n`;
    } finally {
      setTerminal(msg);
    }
  }, [explorer, setTerminal, setBuildCount]);

  return { runBuild, terminalState, setTerminalState };
};

export default useCmd;