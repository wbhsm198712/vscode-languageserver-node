/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as cp from 'child_process';
import ChildProcess = cp.ChildProcess;

import { join } from 'path';

const isWindows = (process.platform === 'win32');
const isMacintosh = (process.platform === 'darwin');
const isLinux = (process.platform === 'linux');
export function terminate(process: ChildProcess, cwd?: string): boolean {
	if (isWindows) {
		try {
			// This we run in Atom execFileSync is available.
			// Ignore stderr since this is otherwise piped to parent.stderr
			// which might be already closed.
			let options:any = {
				stdio: ['pipe', 'pipe', 'ignore']
			};
			if (cwd) {
				options.cwd = cwd
			}
			(<any>cp).execFileSync('taskkill', ['/T', '/F', '/PID', process.pid.toString()], options);
			return true;
		} catch (err) {
			return false;
		}
	} else if (isLinux || isMacintosh) {
		try {
			var cmd = join(__dirname, 'terminateProcess.sh');
			var result = (<any>cp).spawnSync(cmd, [process.pid.toString()]);
			return result.error ? false : true;
		} catch (err) {
			return false;
		}
	} else {
		process.kill('SIGKILL');
		return true;
	}
}