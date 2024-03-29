require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 1542:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = __nccwpck_require__(785);


/***/ }),

/***/ 785:
/***/ ((module) => {

"use strict";


var AsyncLock = function (opts) {
	opts = opts || {};

	this.Promise = opts.Promise || Promise;

	// format: {key : [fn, fn]}
	// queues[key] = null indicates no job running for key
	this.queues = Object.create(null);

	// lock is reentrant for same domain
	this.domainReentrant = opts.domainReentrant || false;
	if (this.domainReentrant) {
		if (typeof process === 'undefined' || typeof process.domain === 'undefined') {
			throw new Error(
				'Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, ' +
				'use a NodeJS version that still implements Domain, or install a browser polyfill.');
		}
		// domain of current running func {key : fn}
		this.domains = Object.create(null);
	}

	this.timeout = opts.timeout || AsyncLock.DEFAULT_TIMEOUT;
	this.maxOccupationTime = opts.maxOccupationTime || AsyncLock.DEFAULT_MAX_OCCUPATION_TIME;
	this.maxExecutionTime = opts.maxExecutionTime || AsyncLock.DEFAULT_MAX_EXECUTION_TIME;
	if (opts.maxPending === Infinity || (Number.isInteger(opts.maxPending) && opts.maxPending >= 0)) {
		this.maxPending = opts.maxPending;
	} else {
		this.maxPending = AsyncLock.DEFAULT_MAX_PENDING;
	}
};

AsyncLock.DEFAULT_TIMEOUT = 0; //Never
AsyncLock.DEFAULT_MAX_OCCUPATION_TIME = 0; //Never
AsyncLock.DEFAULT_MAX_EXECUTION_TIME = 0; //Never
AsyncLock.DEFAULT_MAX_PENDING = 1000;

/**
 * Acquire Locks
 *
 * @param {String|Array} key 	resource key or keys to lock
 * @param {function} fn 	async function
 * @param {function} cb 	callback function, otherwise will return a promise
 * @param {Object} opts 	options
 */
AsyncLock.prototype.acquire = function (key, fn, cb, opts) {
	if (Array.isArray(key)) {
		return this._acquireBatch(key, fn, cb, opts);
	}

	if (typeof (fn) !== 'function') {
		throw new Error('You must pass a function to execute');
	}

	// faux-deferred promise using new Promise() (as Promise.defer is deprecated)
	var deferredResolve = null;
	var deferredReject = null;
	var deferred = null;

	if (typeof (cb) !== 'function') {
		opts = cb;
		cb = null;

		// will return a promise
		deferred = new this.Promise(function(resolve, reject) {
			deferredResolve = resolve;
			deferredReject = reject;
		});
	}

	opts = opts || {};

	var resolved = false;
	var timer = null;
	var occupationTimer = null;
	var executionTimer = null;
	var self = this;

	var done = function (locked, err, ret) {

		if (occupationTimer) {
			clearTimeout(occupationTimer);
			occupationTimer = null;
		}

		if (executionTimer) {
			clearTimeout(executionTimer);
			executionTimer = null;
		}

		if (locked) {
			if (!!self.queues[key] && self.queues[key].length === 0) {
				delete self.queues[key];
			}
			if (self.domainReentrant) {
				delete self.domains[key];
			}
		}

		if (!resolved) {
			if (!deferred) {
				if (typeof (cb) === 'function') {
					cb(err, ret);
				}
			}
			else {
				//promise mode
				if (err) {
					deferredReject(err);
				}
				else {
					deferredResolve(ret);
				}
			}
			resolved = true;
		}

		if (locked) {
			//run next func
			if (!!self.queues[key] && self.queues[key].length > 0) {
				self.queues[key].shift()();
			}
		}
	};

	var exec = function (locked) {
		if (resolved) { // may due to timed out
			return done(locked);
		}

		if (timer) {
			clearTimeout(timer);
			timer = null;
		}

		if (self.domainReentrant && locked) {
			self.domains[key] = process.domain;
		}

		var maxExecutionTime = opts.maxExecutionTime || self.maxExecutionTime;
		if (maxExecutionTime) {
			executionTimer = setTimeout(function () {
				if (!!self.queues[key]) {
					done(locked, new Error('Maximum execution time is exceeded ' + key));
				}
			}, maxExecutionTime);
		}

		// Callback mode
		if (fn.length === 1) {
			var called = false;
			try {
				fn(function (err, ret) {
					if (!called) {
						called = true;
						done(locked, err, ret);
					}
				});
			} catch (err) {
				// catching error thrown in user function fn
				if (!called) {
					called = true;
					done(locked, err);
				}
			}
		}
		else {
			// Promise mode
			self._promiseTry(function () {
				return fn();
			})
			.then(function(ret){
				done(locked, undefined, ret);
			}, function(error){
				done(locked, error);
			});
		}
	};

	if (self.domainReentrant && !!process.domain) {
		exec = process.domain.bind(exec);
	}

	if (!self.queues[key]) {
		self.queues[key] = [];
		exec(true);
	}
	else if (self.domainReentrant && !!process.domain && process.domain === self.domains[key]) {
		// If code is in the same domain of current running task, run it directly
		// Since lock is re-enterable
		exec(false);
	}
	else if (self.queues[key].length >= self.maxPending) {
		done(false, new Error('Too many pending tasks in queue ' + key));
	}
	else {
		var taskFn = function () {
			exec(true);
		};
		if (opts.skipQueue) {
			self.queues[key].unshift(taskFn);
		} else {
			self.queues[key].push(taskFn);
		}

		var timeout = opts.timeout || self.timeout;
		if (timeout) {
			timer = setTimeout(function () {
				timer = null;
				done(false, new Error('async-lock timed out in queue ' + key));
			}, timeout);
		}
	}

	var maxOccupationTime = opts.maxOccupationTime || self.maxOccupationTime;
		if (maxOccupationTime) {
			occupationTimer = setTimeout(function () {
				if (!!self.queues[key]) {
					done(false, new Error('Maximum occupation time is exceeded in queue ' + key));
				}
			}, maxOccupationTime);
		}

	if (deferred) {
		return deferred;
	}
};

/*
 * Below is how this function works:
 *
 * Equivalent code:
 * self.acquire(key1, function(cb){
 *     self.acquire(key2, function(cb){
 *         self.acquire(key3, fn, cb);
 *     }, cb);
 * }, cb);
 *
 * Equivalent code:
 * var fn3 = getFn(key3, fn);
 * var fn2 = getFn(key2, fn3);
 * var fn1 = getFn(key1, fn2);
 * fn1(cb);
 */
AsyncLock.prototype._acquireBatch = function (keys, fn, cb, opts) {
	if (typeof (cb) !== 'function') {
		opts = cb;
		cb = null;
	}

	var self = this;
	var getFn = function (key, fn) {
		return function (cb) {
			self.acquire(key, fn, cb, opts);
		};
	};

	var fnx = keys.reduceRight(function (prev, key) {
		return getFn(key, prev);
	}, fn);

	if (typeof (cb) === 'function') {
		fnx(cb);
	}
	else {
		return new this.Promise(function (resolve, reject) {
			// check for promise mode in case keys is empty array
			if (fnx.length === 1) {
				fnx(function (err, ret) {
					if (err) {
						reject(err);
					}
					else {
						resolve(ret);
					}
				});
			} else {
				resolve(fnx());
			}
		});
	}
};

/*
 *	Whether there is any running or pending asyncFunc
 *
 *	@param {String} key
 */
AsyncLock.prototype.isBusy = function (key) {
	if (!key) {
		return Object.keys(this.queues).length > 0;
	}
	else {
		return !!this.queues[key];
	}
};

/**
 * Promise.try() implementation to become independent of Q-specific methods
 */
AsyncLock.prototype._promiseTry = function(fn) {
	try {
		return this.Promise.resolve(fn());
	} catch (e) {
		return this.Promise.reject(e);
	}
};

module.exports = AsyncLock;


/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(6891);
var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 3268:
/***/ ((module) => {

"use strict";


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, search, replacement) {
  search = search instanceof RegExp ? search : new RegExp(escapeRegExp(search), 'g');

  return str.replace(search, replacement);
}

var CleanGitRef = {
  clean: function clean(value) {
    if (typeof value !== 'string') {
      throw new Error('Expected a string, received: ' + value);
    }

    value = replaceAll(value, './', '/');
    value = replaceAll(value, '..', '.');
    value = replaceAll(value, ' ', '-');
    value = replaceAll(value, /^[~^:?*\\\-]/g, '');
    value = replaceAll(value, /[~^:?*\\]/g, '-');
    value = replaceAll(value, /[~^:?*\\\-]$/g, '');
    value = replaceAll(value, '@{', '-');
    value = replaceAll(value, /\.$/g, '');
    value = replaceAll(value, /\/$/g, '');
    value = replaceAll(value, /\.lock$/g, '');
    return value;
  }
};

module.exports = CleanGitRef;

/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 3201:
/***/ ((__unused_webpack_module, exports) => {

/*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*exported CRC32 */
var CRC32;
(function (factory) {
	/*jshint ignore:start */
	/*eslint-disable */
	if(typeof DO_NOT_EXPORT_CRC === 'undefined') {
		if(true) {
			factory(exports);
		} else {}
	} else {
		factory(CRC32 = {});
	}
	/*eslint-enable */
	/*jshint ignore:end */
}(function(CRC32) {
CRC32.version = '1.2.2';
/*global Int32Array */
function signed_crc_table() {
	var c = 0, table = new Array(256);

	for(var n =0; n != 256; ++n){
		c = n;
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		table[n] = c;
	}

	return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table;
}

var T0 = signed_crc_table();
function slice_by_16_tables(T) {
	var c = 0, v = 0, n = 0, table = typeof Int32Array !== 'undefined' ? new Int32Array(4096) : new Array(4096) ;

	for(n = 0; n != 256; ++n) table[n] = T[n];
	for(n = 0; n != 256; ++n) {
		v = T[n];
		for(c = 256 + n; c < 4096; c += 256) v = table[c] = (v >>> 8) ^ T[v & 0xFF];
	}
	var out = [];
	for(n = 1; n != 16; ++n) out[n - 1] = typeof Int32Array !== 'undefined' ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
	return out;
}
var TT = slice_by_16_tables(T0);
var T1 = TT[0],  T2 = TT[1],  T3 = TT[2],  T4 = TT[3],  T5 = TT[4];
var T6 = TT[5],  T7 = TT[6],  T8 = TT[7],  T9 = TT[8],  Ta = TT[9];
var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
function crc32_bstr(bstr, seed) {
	var C = seed ^ -1;
	for(var i = 0, L = bstr.length; i < L;) C = (C>>>8) ^ T0[(C^bstr.charCodeAt(i++))&0xFF];
	return ~C;
}

function crc32_buf(B, seed) {
	var C = seed ^ -1, L = B.length - 15, i = 0;
	for(; i < L;) C =
		Tf[B[i++] ^ (C & 255)] ^
		Te[B[i++] ^ ((C >> 8) & 255)] ^
		Td[B[i++] ^ ((C >> 16) & 255)] ^
		Tc[B[i++] ^ (C >>> 24)] ^
		Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^
		T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^
		T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
	L += 15;
	while(i < L) C = (C>>>8) ^ T0[(C^B[i++])&0xFF];
	return ~C;
}

function crc32_str(str, seed) {
	var C = seed ^ -1;
	for(var i = 0, L = str.length, c = 0, d = 0; i < L;) {
		c = str.charCodeAt(i++);
		if(c < 0x80) {
			C = (C>>>8) ^ T0[(C^c)&0xFF];
		} else if(c < 0x800) {
			C = (C>>>8) ^ T0[(C ^ (192|((c>>6)&31)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(c&63)))&0xFF];
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64; d = str.charCodeAt(i++)&1023;
			C = (C>>>8) ^ T0[(C ^ (240|((c>>8)&7)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((c>>2)&63)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((d>>6)&15)|((c&3)<<4)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(d&63)))&0xFF];
		} else {
			C = (C>>>8) ^ T0[(C ^ (224|((c>>12)&15)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((c>>6)&63)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(c&63)))&0xFF];
		}
	}
	return ~C;
}
CRC32.table = T0;
// $FlowIgnore
CRC32.bstr = crc32_bstr;
// $FlowIgnore
CRC32.buf = crc32_buf;
// $FlowIgnore
CRC32.str = crc32_str;
}));


/***/ }),

/***/ 5211:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright (c) 2006, 2008 Tony Garnock-Jones <tonyg@lshift.net>
// Copyright (c) 2006, 2008 LShift Ltd. <query@lshift.net>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var onp = __nccwpck_require__(8101);

function longestCommonSubsequence(file1, file2) {
  var diff = new onp(file1, file2);
  diff.compose();
  var ses = diff.getses();

  var root;
  var prev;
  var file1RevIdx = file1.length - 1,
      file2RevIdx = file2.length - 1;
  for (var i = ses.length - 1; i >= 0; --i) {
      if (ses[i].t === diff.SES_COMMON) {
        if (prev) {
          prev.chain = {
            file1index: file1RevIdx,
            file2index: file2RevIdx,
            chain: null
          };
          prev = prev.chain;
        } else {
          root = {
            file1index: file1RevIdx,
            file2index: file2RevIdx,
            chain: null
          };
          prev = root;
        }
        file1RevIdx--;
        file2RevIdx--;
      } else if (ses[i].t === diff.SES_DELETE) {
        file1RevIdx--;
      } else if (ses[i].t === diff.SES_ADD) {
        file2RevIdx--;
      }
  }

  var tail = {
    file1index: -1,
    file2index: -1,
    chain: null
  };

  if (!prev) {
    return tail;
  }

  prev.chain = tail;

  return root;
}

function diffIndices(file1, file2) {
  // We apply the LCS to give a simple representation of the
  // offsets and lengths of mismatched chunks in the input
  // files. This is used by diff3_merge_indices below.

  var result = [];
  var tail1 = file1.length;
  var tail2 = file2.length;

  for (var candidate = longestCommonSubsequence(file1, file2); candidate !== null; candidate = candidate.chain) {
    var mismatchLength1 = tail1 - candidate.file1index - 1;
    var mismatchLength2 = tail2 - candidate.file2index - 1;
    tail1 = candidate.file1index;
    tail2 = candidate.file2index;

    if (mismatchLength1 || mismatchLength2) {
      result.push({
        file1: [tail1 + 1, mismatchLength1],
        file2: [tail2 + 1, mismatchLength2]
      });
    }
  }

  result.reverse();
  return result;
}

function diff3MergeIndices(a, o, b) {
  // Given three files, A, O, and B, where both A and B are
  // independently derived from O, returns a fairly complicated
  // internal representation of merge decisions it's taken. The
  // interested reader may wish to consult
  //
  // Sanjeev Khanna, Keshav Kunal, and Benjamin C. Pierce. "A
  // Formal Investigation of Diff3." In Arvind and Prasad,
  // editors, Foundations of Software Technology and Theoretical
  // Computer Science (FSTTCS), December 2007.
  //
  // (http://www.cis.upenn.edu/~bcpierce/papers/diff3-short.pdf)
  var i;

  var m1 = diffIndices(o, a);
  var m2 = diffIndices(o, b);

  var hunks = [];

  function addHunk(h, side) {
    hunks.push([h.file1[0], side, h.file1[1], h.file2[0], h.file2[1]]);
  }
  for (i = 0; i < m1.length; i++) {
    addHunk(m1[i], 0);
  }
  for (i = 0; i < m2.length; i++) {
    addHunk(m2[i], 2);
  }
  hunks.sort(function(x, y) {
    return x[0] - y[0]
  });

  var result = [];
  var commonOffset = 0;

  function copyCommon(targetOffset) {
    if (targetOffset > commonOffset) {
      result.push([1, commonOffset, targetOffset - commonOffset]);
      commonOffset = targetOffset;
    }
  }

  for (var hunkIndex = 0; hunkIndex < hunks.length; hunkIndex++) {
    var firstHunkIndex = hunkIndex;
    var hunk = hunks[hunkIndex];
    var regionLhs = hunk[0];
    var regionRhs = regionLhs + hunk[2];
    while (hunkIndex < hunks.length - 1) {
      var maybeOverlapping = hunks[hunkIndex + 1];
      var maybeLhs = maybeOverlapping[0];
      if (maybeLhs > regionRhs) break;
      regionRhs = Math.max(regionRhs, maybeLhs + maybeOverlapping[2]);
      hunkIndex++;
    }

    copyCommon(regionLhs);
    if (firstHunkIndex == hunkIndex) {
      // The "overlap" was only one hunk long, meaning that
      // there's no conflict here. Either a and o were the
      // same, or b and o were the same.
      if (hunk[4] > 0) {
        result.push([hunk[1], hunk[3], hunk[4]]);
      }
    } else {
      // A proper conflict. Determine the extents of the
      // regions involved from a, o and b. Effectively merge
      // all the hunks on the left into one giant hunk, and
      // do the same for the right; then, correct for skew
      // in the regions of o that each side changed, and
      // report appropriate spans for the three sides.
      var regions = {
        0: [a.length, -1, o.length, -1],
        2: [b.length, -1, o.length, -1]
      };
      for (i = firstHunkIndex; i <= hunkIndex; i++) {
        hunk = hunks[i];
        var side = hunk[1];
        var r = regions[side];
        var oLhs = hunk[0];
        var oRhs = oLhs + hunk[2];
        var abLhs = hunk[3];
        var abRhs = abLhs + hunk[4];
        r[0] = Math.min(abLhs, r[0]);
        r[1] = Math.max(abRhs, r[1]);
        r[2] = Math.min(oLhs, r[2]);
        r[3] = Math.max(oRhs, r[3]);
      }
      var aLhs = regions[0][0] + (regionLhs - regions[0][2]);
      var aRhs = regions[0][1] + (regionRhs - regions[0][3]);
      var bLhs = regions[2][0] + (regionLhs - regions[2][2]);
      var bRhs = regions[2][1] + (regionRhs - regions[2][3]);
      result.push([-1,
        aLhs, aRhs - aLhs,
        regionLhs, regionRhs - regionLhs,
        bLhs, bRhs - bLhs
      ]);
    }
    commonOffset = regionRhs;
  }

  copyCommon(o.length);
  return result;
}

function diff3Merge(a, o, b) {
  // Applies the output of Diff.diff3_merge_indices to actually
  // construct the merged file; the returned result alternates
  // between "ok" and "conflict" blocks.

  var result = [];
  var files = [a, o, b];
  var indices = diff3MergeIndices(a, o, b);

  var okLines = [];

  function flushOk() {
    if (okLines.length) {
      result.push({
        ok: okLines
      });
    }
    okLines = [];
  }

  function pushOk(xs) {
    for (var j = 0; j < xs.length; j++) {
      okLines.push(xs[j]);
    }
  }

  function isTrueConflict(rec) {
    if (rec[2] != rec[6]) return true;
    var aoff = rec[1];
    var boff = rec[5];
    for (var j = 0; j < rec[2]; j++) {
      if (a[j + aoff] != b[j + boff]) return true;
    }
    return false;
  }

  for (var i = 0; i < indices.length; i++) {
    var x = indices[i];
    var side = x[0];
    if (side == -1) {
      if (!isTrueConflict(x)) {
        pushOk(files[0].slice(x[1], x[1] + x[2]));
      } else {
        flushOk();
        result.push({
          conflict: {
            a: a.slice(x[1], x[1] + x[2]),
            aIndex: x[1],
            o: o.slice(x[3], x[3] + x[4]),
            oIndex: x[3],
            b: b.slice(x[5], x[5] + x[6]),
            bIndex: x[5]
          }
        });
      }
    } else {
      pushOk(files[side].slice(x[1], x[1] + x[2]));
    }
  }

  flushOk();
  return result;
}

module.exports = diff3Merge;


/***/ }),

/***/ 8101:
/***/ ((module) => {

/*
 * URL: https://github.com/cubicdaiya/onp
 *
 * Copyright (c) 2013 Tatsuhiko Kubo <cubicdaiya@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/**
 * The algorithm implemented here is based on "An O(NP) Sequence Comparison Algorithm"
 * by described by Sun Wu, Udi Manber and Gene Myers
*/
module.exports = function (a_, b_) {
    var a          = a_,
        b          = b_,
        m          = a.length,
        n          = b.length,
        reverse    = false,
        ed         = null,
        offset     = m + 1,
        path       = [],
        pathposi   = [],
        ses        = [],
        lcs        = "",
        SES_DELETE = -1,
        SES_COMMON = 0,
        SES_ADD    = 1;

    var tmp1,
        tmp2;

    var init = function () {
        if (m >= n) {
            tmp1    = a;
            tmp2    = m;
            a       = b;
            b       = tmp1;
            m       = n;
            n       = tmp2;
            reverse = true;
            offset = m + 1;
        }
    };

    var P = function (x, y, k) {
        return {
            'x' : x,
            'y' : y,
            'k' : k,
        };
    };

    var seselem = function (elem, t) {
        return {
            'elem' : elem,
            't'    : t,
        };
    };

    var snake = function (k, p, pp) {
        var r, x, y;
        if (p > pp) {
            r = path[k-1+offset];
        } else {
            r = path[k+1+offset];
        }

        y = Math.max(p, pp);
        x = y - k;
        while (x < m && y < n && a[x] === b[y]) {
            ++x;
            ++y;
        }

        path[k+offset] = pathposi.length;
        pathposi[pathposi.length] = new P(x, y, r);
        return y;
    };

    var recordseq = function (epc) {
        var x_idx, y_idx, px_idx, py_idx, i;
        x_idx  = y_idx  = 1;
        px_idx = py_idx = 0;
        for (i=epc.length-1;i>=0;--i) {
            while(px_idx < epc[i].x || py_idx < epc[i].y) {
                if (epc[i].y - epc[i].x > py_idx - px_idx) {
                    if (reverse) {
                        ses[ses.length] = new seselem(b[py_idx], SES_DELETE);
                    } else {
                        ses[ses.length] = new seselem(b[py_idx], SES_ADD);
                    }
                    ++y_idx;
                    ++py_idx;
                } else if (epc[i].y - epc[i].x < py_idx - px_idx) {
                    if (reverse) {
                        ses[ses.length] = new seselem(a[px_idx], SES_ADD);
                    } else {
                        ses[ses.length] = new seselem(a[px_idx], SES_DELETE);
                    }
                    ++x_idx;
                    ++px_idx;
                } else {
                    ses[ses.length] = new seselem(a[px_idx], SES_COMMON);
                    lcs += a[px_idx];
                    ++x_idx;
                    ++y_idx;
                    ++px_idx;
                    ++py_idx;
                }
            }
        }
    };

    init();

    return {
        SES_DELETE : -1,
        SES_COMMON :  0,
        SES_ADD    :  1,
        editdistance : function () {
            return ed;
        },
        getlcs : function () {
            return lcs;
        },
        getses : function () {
            return ses;
        },
        compose : function () {
            var delta, size, fp, p, r, epc, i, k;
            delta  = n - m;
            size   = m + n + 3;
            fp     = {};
            for (i=0;i<size;++i) {
                fp[i] = -1;
                path[i] = -1;
            }
            p = -1;
            do {
                ++p;
                for (k=-p;k<=delta-1;++k) {
                    fp[k+offset] = snake(k, fp[k-1+offset]+1, fp[k+1+offset]);
                }
                for (k=delta+p;k>=delta+1;--k) {
                    fp[k+offset] = snake(k, fp[k-1+offset]+1, fp[k+1+offset]);
                }
                fp[delta+offset] = snake(delta, fp[delta-1+offset]+1, fp[delta+1+offset]);
            } while (fp[delta+offset] !== n);

            ed = delta + 2 * p;

            r = path[delta+offset];

            epc  = [];
            while (r !== -1) {
                epc[epc.length] = new P(pathposi[r].x, pathposi[r].y, null);
                r = pathposi[r].k;
            }
            recordseq(epc);
        }
    };
};


/***/ }),

/***/ 6863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __nccwpck_require__(7147)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __nccwpck_require__(1734)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 1734:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __nccwpck_require__(1017);
var isWindows = process.platform === 'win32';
var fs = __nccwpck_require__(7147);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 7625:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __nccwpck_require__(1017)
var minimatch = __nccwpck_require__(3973)
var isAbsolute = __nccwpck_require__(8714)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 1957:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __nccwpck_require__(7147)
var rp = __nccwpck_require__(6863)
var minimatch = __nccwpck_require__(3973)
var Minimatch = minimatch.Minimatch
var inherits = __nccwpck_require__(4124)
var EE = (__nccwpck_require__(2361).EventEmitter)
var path = __nccwpck_require__(1017)
var assert = __nccwpck_require__(9491)
var isAbsolute = __nccwpck_require__(8714)
var globSync = __nccwpck_require__(9010)
var common = __nccwpck_require__(7625)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __nccwpck_require__(2492)
var util = __nccwpck_require__(3837)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __nccwpck_require__(1223)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 9010:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __nccwpck_require__(7147)
var rp = __nccwpck_require__(6863)
var minimatch = __nccwpck_require__(3973)
var Minimatch = minimatch.Minimatch
var Glob = (__nccwpck_require__(1957).Glob)
var util = __nccwpck_require__(3837)
var path = __nccwpck_require__(1017)
var assert = __nccwpck_require__(9491)
var isAbsolute = __nccwpck_require__(8714)
var common = __nccwpck_require__(7625)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 1230:
/***/ ((module) => {

// A simple implementation of make-array
function makeArray (subject) {
  return Array.isArray(subject)
    ? subject
    : [subject]
}

const EMPTY = ''
const SPACE = ' '
const ESCAPE = '\\'
const REGEX_TEST_BLANK_LINE = /^\s+$/
const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/
const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/
const REGEX_SPLITALL_CRLF = /\r?\n/g
// /foo,
// ./foo,
// ../foo,
// .
// ..
const REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/

const SLASH = '/'
const KEY_IGNORE = typeof Symbol !== 'undefined'
  ? Symbol.for('node-ignore')
  /* istanbul ignore next */
  : 'node-ignore'

const define = (object, key, value) =>
  Object.defineProperty(object, key, {value})

const REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g

const RETURN_FALSE = () => false

// Sanitize the range of a regular expression
// The cases are complicated, see test cases for details
const sanitizeRange = range => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0)
    ? match
    // Invalid range (out of order) which is ok for gitignore rules but
    //   fatal for JavaScript regular expression, so eliminate it.
    : EMPTY
)

// See fixtures #59
const cleanRangeBackSlash = slashes => {
  const {length} = slashes
  return slashes.slice(0, length - length % 2)
}

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'
const REPLACERS = [

  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a \ ) -> (a  )
    /\\?\s+$/,
    match => match.indexOf('\\') === 0
      ? SPACE
      : EMPTY
  ],

  // replace (\ ) with ' '
  [
    /\\\s/g,
    () => SPACE
  ],

  // Escape metacharacters
  // which is written down by users but means special for regular expressions.

  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\$.|*+(){^]/g,
    match => `\\${match}`
  ],

  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => '[^/]'
  ],

  // leading slash
  [

    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => '^'
  ],

  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => '\\/'
  ],

  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,

    // '**/foo' <-> 'foo'
    () => '^(?:.*\\/)?'
  ],

  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer () {
      // If has a slash `/` at the beginning or middle
      return !/\/(?!$)/.test(this)
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern

        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
        ? '(?:^|\\/)'

        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        : '^'
    }
  ],

  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,

    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer

    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length

      // case: /**/
      // > A slash followed by two consecutive asterisks then a slash matches
      // >   zero or more directories.
      // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
      // '/**/'
      ? '(?:\\/[^\\/]+)*'

      // case: /**
      // > A trailing `"/**"` matches everything inside.

      // #21: everything inside but it should not include the current folder
      : '\\/.+'
  ],

  // intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'

    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule
    /(^|[^\\]+)\\\*(?=.+)/g,

    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1) => `${p1}[^\\/]*`
  ],

  [
    // unescape, revert step 3 except for back slash
    // For example, if a user escape a '\\*',
    // after step 3, the result will be '\\\\\\*'
    /\\\\\\(?=[$.|*+(){^])/g,
    () => ESCAPE
  ],

  [
    // '\\\\' -> '\\'
    /\\\\/g,
    () => ESCAPE
  ],

  [
    // > The range notation, e.g. [a-zA-Z],
    // > can be used to match one of the characters in a range.

    // `\` is escaped by step 3
    /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
    (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE
      // '\\[bar]' -> '\\\\[bar\\]'
      ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}`
      : close === ']'
        ? endEscape.length % 2 === 0
          // A normal case, and it is a range notation
          // '[bar]'
          // '[bar\\\\]'
          ? `[${sanitizeRange(range)}${endEscape}]`
          // Invalid range notaton
          // '[bar\\]' -> '[bar\\\\]'
          : '[]'
        : '[]'
  ],

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,

    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38

    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    match => /\/$/.test(match)
      // foo/ will not match 'foo'
      ? `${match}$`
      // foo matches 'foo' and 'foo/'
      : `${match}(?=$|\\/$)`
  ],

  // trailing wildcard
  [
    /(\^|\\\/)?\\\*$/,
    (_, p1) => {
      const prefix = p1
        // '\^':
        // '/*' does not match EMPTY
        // '/*' does not match everything

        // '\\\/':
        // 'abc/*' does not match 'abc/'
        ? `${p1}[^/]+`

        // 'a*' matches 'a'
        // 'a*' matches 'aa'
        : '[^/]*'

      return `${prefix}(?=$|\\/$)`
    }
  ],
]

// A simple cache, because an ignore rule only has only one certain meaning
const regexCache = Object.create(null)

// @param {pattern}
const makeRegex = (pattern, ignoreCase) => {
  let source = regexCache[pattern]

  if (!source) {
    source = REPLACERS.reduce(
      (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
      pattern
    )
    regexCache[pattern] = source
  }

  return ignoreCase
    ? new RegExp(source, 'i')
    : new RegExp(source)
}

const isString = subject => typeof subject === 'string'

// > A blank line matches no files, so it can serve as a separator for readability.
const checkPattern = pattern => pattern
  && isString(pattern)
  && !REGEX_TEST_BLANK_LINE.test(pattern)

  // > A line starting with # serves as a comment.
  && pattern.indexOf('#') !== 0

const splitPattern = pattern => pattern.split(REGEX_SPLITALL_CRLF)

class IgnoreRule {
  constructor (
    origin,
    pattern,
    negative,
    regex
  ) {
    this.origin = origin
    this.pattern = pattern
    this.negative = negative
    this.regex = regex
  }
}

const createRule = (pattern, ignoreCase) => {
  const origin = pattern
  let negative = false

  // > An optional prefix "!" which negates the pattern;
  if (pattern.indexOf('!') === 0) {
    negative = true
    pattern = pattern.substr(1)
  }

  pattern = pattern
  // > Put a backslash ("\") in front of the first "!" for patterns that
  // >   begin with a literal "!", for example, `"\!important!.txt"`.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, '!')
  // > Put a backslash ("\") in front of the first hash for patterns that
  // >   begin with a hash.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, '#')

  const regex = makeRegex(pattern, ignoreCase)

  return new IgnoreRule(
    origin,
    pattern,
    negative,
    regex
  )
}

const throwError = (message, Ctor) => {
  throw new Ctor(message)
}

const checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    )
  }

  // We don't know if we should ignore EMPTY, so throw
  if (!path) {
    return doThrow(`path must not be empty`, TypeError)
  }

  // Check if it is a relative path
  if (checkPath.isNotRelative(path)) {
    const r = '`path.relative()`d'
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    )
  }

  return true
}

const isNotRelative = path => REGEX_TEST_INVALID_PATH.test(path)

checkPath.isNotRelative = isNotRelative
checkPath.convert = p => p

class Ignore {
  constructor ({
    ignorecase = true,
    ignoreCase = ignorecase,
    allowRelativePaths = false
  } = {}) {
    define(this, KEY_IGNORE, true)

    this._rules = []
    this._ignoreCase = ignoreCase
    this._allowRelativePaths = allowRelativePaths
    this._initCache()
  }

  _initCache () {
    this._ignoreCache = Object.create(null)
    this._testCache = Object.create(null)
  }

  _addPattern (pattern) {
    // #32
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules)
      this._added = true
      return
    }

    if (checkPattern(pattern)) {
      const rule = createRule(pattern, this._ignoreCase)
      this._added = true
      this._rules.push(rule)
    }
  }

  // @param {Array<string> | string | Ignore} pattern
  add (pattern) {
    this._added = false

    makeArray(
      isString(pattern)
        ? splitPattern(pattern)
        : pattern
    ).forEach(this._addPattern, this)

    // Some rules have just added to the ignore,
    // making the behavior changed.
    if (this._added) {
      this._initCache()
    }

    return this
  }

  // legacy
  addPattern (pattern) {
    return this.add(pattern)
  }

  //          |           ignored : unignored
  // negative |   0:0   |   0:1   |   1:0   |   1:1
  // -------- | ------- | ------- | ------- | --------
  //     0    |  TEST   |  TEST   |  SKIP   |    X
  //     1    |  TESTIF |  SKIP   |  TEST   |    X

  // - SKIP: always skip
  // - TEST: always test
  // - TESTIF: only test if checkUnignored
  // - X: that never happen

  // @param {boolean} whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.

  // @returns {TestResult} true if a file is ignored
  _testOne (path, checkUnignored) {
    let ignored = false
    let unignored = false

    this._rules.forEach(rule => {
      const {negative} = rule
      if (
        unignored === negative && ignored !== unignored
        || negative && !ignored && !unignored && !checkUnignored
      ) {
        return
      }

      const matched = rule.regex.test(path)

      if (matched) {
        ignored = !negative
        unignored = negative
      }
    })

    return {
      ignored,
      unignored
    }
  }

  // @returns {TestResult}
  _test (originalPath, cache, checkUnignored, slices) {
    const path = originalPath
      // Supports nullable path
      && checkPath.convert(originalPath)

    checkPath(
      path,
      originalPath,
      this._allowRelativePaths
        ? RETURN_FALSE
        : throwError
    )

    return this._t(path, cache, checkUnignored, slices)
  }

  _t (path, cache, checkUnignored, slices) {
    if (path in cache) {
      return cache[path]
    }

    if (!slices) {
      // path/to/a.js
      // ['path', 'to', 'a.js']
      slices = path.split(SLASH)
    }

    slices.pop()

    // If the path has no parent directory, just test it
    if (!slices.length) {
      return cache[path] = this._testOne(path, checkUnignored)
    }

    const parent = this._t(
      slices.join(SLASH) + SLASH,
      cache,
      checkUnignored,
      slices
    )

    // If the path contains a parent directory, check the parent first
    return cache[path] = parent.ignored
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      ? parent
      : this._testOne(path, checkUnignored)
  }

  ignores (path) {
    return this._test(path, this._ignoreCache, false).ignored
  }

  createFilter () {
    return path => !this.ignores(path)
  }

  filter (paths) {
    return makeArray(paths).filter(this.createFilter())
  }

  // @returns {TestResult}
  test (path) {
    return this._test(path, this._testCache, true)
  }
}

const factory = options => new Ignore(options)

const isPathValid = path =>
  checkPath(path && checkPath.convert(path), path, RETURN_FALSE)

factory.isPathValid = isPathValid

// Fixes typescript
factory.default = factory

module.exports = factory

// Windows
// --------------------------------------------------------------
/* istanbul ignore if  */
if (
  // Detect `process` so that it can run in browsers.
  typeof process !== 'undefined'
  && (
    process.env && process.env.IGNORE_TEST_WIN32
    || process.platform === 'win32'
  )
) {
  /* eslint no-control-regex: "off" */
  const makePosix = str => /^\\\\\?\\/.test(str)
  || /["<>|\u0000-\u001F]+/u.test(str)
    ? str
    : str.replace(/\\/g, '/')

  checkPath.convert = makePosix

  // 'C:\\foo'     <- 'C:\\foo' has been converted to 'C:/'
  // 'd:\\foo'
  const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i
  checkPath.isNotRelative = path =>
    REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path)
    || isNotRelative(path)
}


/***/ }),

/***/ 2492:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
var reqs = Object.create(null)
var once = __nccwpck_require__(1223)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 4124:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(3837);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(8544);
}


/***/ }),

/***/ 8544:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = (function () { try { return __nccwpck_require__(1017) } catch (e) {}}()) || {
  sep: '/'
}
minimatch.sep = path.sep

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  b = b || {}
  var t = {}
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || typeof def !== 'object' || !Object.keys(def).length) {
    return minimatch
  }

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }
  m.Minimatch.defaults = function defaults (options) {
    return orig.defaults(ext(def, options)).Minimatch
  }

  m.filter = function filter (pattern, options) {
    return orig.filter(pattern, ext(def, options))
  }

  m.defaults = function defaults (options) {
    return orig.defaults(ext(def, options))
  }

  m.makeRe = function makeRe (pattern, options) {
    return orig.makeRe(pattern, ext(def, options))
  }

  m.braceExpand = function braceExpand (pattern, options) {
    return orig.braceExpand(pattern, ext(def, options))
  }

  m.match = function (list, pattern, options) {
    return orig.match(list, pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  assertValidPattern(pattern)

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  assertValidPattern(pattern)

  if (!options) options = {}

  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (!options.allowWindowsEscape && path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false
  this.partial = !!options.partial

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = function debug() { console.error.apply(console, arguments) }

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  assertValidPattern(pattern)

  // Thanks to Yeting Li <https://github.com/yetingli> for
  // improving this regexp to avoid a ReDOS vulnerability.
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

var MAX_PATTERN_LENGTH = 1024 * 64
var assertValidPattern = function (pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('invalid pattern')
  }

  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError('pattern is too long')
  }
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  assertValidPattern(pattern)

  var options = this.options

  // shortcuts
  if (pattern === '**') {
    if (!options.noglobstar)
      return GLOBSTAR
    else
      pattern = '*'
  }
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      /* istanbul ignore next */
      case '/': {
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false
      }

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        // split where the last [ was, make sure we don't have
        // an invalid re. if so, re-walk the contents of the
        // would-be class to re-translate any characters that
        // were passed through as-is
        // TODO: It would probably be faster to determine this
        // without a try/catch and a new RegExp, but it's tricky
        // to do safely.  For now, this is safe and works.
        var cs = pattern.substring(classStart + 1, i)
        try {
          RegExp('[' + cs + ']')
        } catch (er) {
          // not a valid class!
          var sp = this.parse(cs, SUBPARSE)
          re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
          hasMagic = hasMagic || sp[1]
          inClass = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '[': case '.': case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) /* istanbul ignore next - should be impossible */ {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) /* istanbul ignore next - should be impossible */ {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = function match (f, partial) {
  if (typeof partial === 'undefined') partial = this.partial
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    /* istanbul ignore if */
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      /* istanbul ignore if */
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      hit = f === p
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else /* istanbul ignore else */ if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    return (fi === fl - 1) && (file[fi] === '')
  }

  // should be unreachable.
  /* istanbul ignore next */
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 1726:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Top level file is just a mixin of submodules & constants


var assign    = (__nccwpck_require__(5483).assign);

var deflate   = __nccwpck_require__(7265);
var inflate   = __nccwpck_require__(6522);
var constants = __nccwpck_require__(8282);

var pako = {};

assign(pako, deflate, inflate, constants);

module.exports = pako;


/***/ }),

/***/ 7265:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";



var zlib_deflate = __nccwpck_require__(978);
var utils        = __nccwpck_require__(5483);
var strings      = __nccwpck_require__(2380);
var msg          = __nccwpck_require__(1890);
var ZStream      = __nccwpck_require__(6442);

var toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

var Z_NO_FLUSH      = 0;
var Z_FINISH        = 4;

var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_SYNC_FLUSH    = 2;

var Z_DEFAULT_COMPRESSION = -1;

var Z_DEFAULT_STRATEGY    = 0;

var Z_DEFLATED  = 8;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array|Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
 * push a chunk with explicit flush (call [[Deflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate(options) {
  if (!(this instanceof Deflate)) return new Deflate(options);

  this.options = utils.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY,
    to: ''
  }, options || {});

  var opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new ZStream();
  this.strm.avail_out = 0;

  var status = zlib_deflate.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }

  if (opt.header) {
    zlib_deflate.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    var dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = zlib_deflate.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the compression context.
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * array format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var status, _mode;

  if (this.ended) { return false; }

  _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = zlib_deflate.deflate(strm, _mode);    /* no bad return value */

    if (status !== Z_STREAM_END && status !== Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }
    if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
      if (this.options.to === 'string') {
        this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
      } else {
        this.onData(utils.shrinkBuf(strm.output, strm.next_out));
      }
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

  // Finalize on the last chunk.
  if (_mode === Z_FINISH) {
    status = zlib_deflate.deflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === Z_SYNC_FLUSH) {
    this.onEnd(Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate(input, options) {
  var deflator = new Deflate(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || msg[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return deflate(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate(input, options);
}


exports.Deflate = Deflate;
exports.deflate = deflate;
exports.deflateRaw = deflateRaw;
exports.gzip = gzip;


/***/ }),

/***/ 6522:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";



var zlib_inflate = __nccwpck_require__(409);
var utils        = __nccwpck_require__(5483);
var strings      = __nccwpck_require__(2380);
var c            = __nccwpck_require__(8282);
var msg          = __nccwpck_require__(1890);
var ZStream      = __nccwpck_require__(6442);
var GZheader     = __nccwpck_require__(5105);

var toString = Object.prototype.toString;

/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
 * push a chunk with explicit flush (call [[Inflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate(options) {
  if (!(this instanceof Inflate)) return new Inflate(options);

  this.options = utils.assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ''
  }, options || {});

  var opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new ZStream();
  this.strm.avail_out = 0;

  var status  = zlib_inflate.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== c.Z_OK) {
    throw new Error(msg[status]);
  }

  this.header = new GZheader();

  zlib_inflate.inflateGetHeader(this.strm, this.header);

  // Setup dictionary
  if (opt.dictionary) {
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) { //In raw mode we need to set the dictionary early
      status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== c.Z_OK) {
        throw new Error(msg[status]);
      }
    }
  }
}

/**
 * Inflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var dictionary = this.options.dictionary;
  var status, _mode;
  var next_out_utf8, tail, utf8str;

  // Flag to properly process Z_BUF_ERROR on testing inflate call
  // when we check that all output data was flushed.
  var allowBufError = false;

  if (this.ended) { return false; }
  _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // Only binary strings can be decompressed on practice
    strm.input = strings.binstring2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */

    if (status === c.Z_NEED_DICT && dictionary) {
      status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
    }

    if (status === c.Z_BUF_ERROR && allowBufError === true) {
      status = c.Z_OK;
      allowBufError = false;
    }

    if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {

        if (this.options.to === 'string') {

          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          tail = strm.next_out - next_out_utf8;
          utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

          this.onData(utf8str);

        } else {
          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
        }
      }
    }

    // When no more input data, we should check that internal inflate buffers
    // are flushed. The only way to do it when avail_out = 0 - run one more
    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
    // Here we set flag to process this error properly.
    //
    // NOTE. Deflate does not return error in this case and does not needs such
    // logic.
    if (strm.avail_in === 0 && strm.avail_out === 0) {
      allowBufError = true;
    }

  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);

  if (status === c.Z_STREAM_END) {
    _mode = c.Z_FINISH;
  }

  // Finalize on the last chunk.
  if (_mode === c.Z_FINISH) {
    status = zlib_inflate.inflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === c.Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === c.Z_SYNC_FLUSH) {
    this.onEnd(c.Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === c.Z_OK) {
    if (this.options.to === 'string') {
      // Glue & convert here, until we teach pako to send
      // utf8 aligned strings to onData
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
 *   , output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err)
 *   console.log(err);
 * }
 * ```
 **/
function inflate(input, options) {
  var inflator = new Inflate(options);

  inflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) { throw inflator.msg || msg[inflator.err]; }

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return inflate(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


exports.Inflate = Inflate;
exports.inflate = inflate;
exports.inflateRaw = inflateRaw;
exports.ungzip  = inflate;


/***/ }),

/***/ 5483:
/***/ ((__unused_webpack_module, exports) => {

"use strict";



var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined');

function _has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

exports.assign = function (obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// reduce buffer size, avoiding mem copy
exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) { return buf; }
  if (buf.subarray) { return buf.subarray(0, size); }
  buf.length = size;
  return buf;
};


var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    return [].concat.apply([], chunks);
  }
};


// Enable/Disable typed arrays use, for testing
//
exports.setTyped = function (on) {
  if (on) {
    exports.Buf8  = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8  = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);


/***/ }),

/***/ 2380:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
// String encode/decode helpers



var utils = __nccwpck_require__(5483);


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
var STR_APPLY_OK = true;
var STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, [ 0 ]); } catch (__) { STR_APPLY_OK = false; }
try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var _utf8len = new utils.Buf8(256);
for (var q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
exports.string2buf = function (str) {
  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new utils.Buf8(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper (used in 2 places)
function buf2binstring(buf, len) {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
      return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
    }
  }

  var result = '';
  for (var i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}


// Convert byte array to binary string
exports.buf2binstring = function (buf) {
  return buf2binstring(buf, buf.length);
};


// Convert binary string (typed, when possible)
exports.binstring2buf = function (str) {
  var buf = new utils.Buf8(str.length);
  for (var i = 0, len = buf.length; i < len; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
};


// convert array to string
exports.buf2string = function (buf, max) {
  var i, out, c, c_len;
  var len = max || buf.length;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  var utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
exports.utf8border = function (buf, max) {
  var pos;

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};


/***/ }),

/***/ 6924:
/***/ ((module) => {

"use strict";


// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
}


module.exports = adler32;


/***/ }),

/***/ 8282:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};


/***/ }),

/***/ 7242:
/***/ ((module) => {

"use strict";


// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
function makeTable() {
  var c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}


module.exports = crc32;


/***/ }),

/***/ 978:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils   = __nccwpck_require__(5483);
var trees   = __nccwpck_require__(8754);
var adler32 = __nccwpck_require__(6924);
var crc32   = __nccwpck_require__(7242);
var msg     = __nccwpck_require__(1890);

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH      = 0;
var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION = -1;


var Z_FILTERED            = 1;
var Z_HUFFMAN_ONLY        = 2;
var Z_RLE                 = 3;
var Z_FIXED               = 4;
var Z_DEFAULT_STRATEGY    = 0;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;


/* The deflate compression method */
var Z_DEFLATED  = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_MEM_LEVEL = 8;


var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS      = 256;
/* number of literal bytes 0..255 */
var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES       = 30;
/* number of distance codes */
var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE     = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only(s, last) {
  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}


function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  utils.arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;      /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match;                       /* matched string */
  var len;                           /* length of current match */
  var best_len = s.prev_length;              /* best match length so far */
  var nice_match = s.nice_match;             /* stop if match long enough */
  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1  = _win[scan + best_len - 1];
  var scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s.block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
//    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head;        /* head of the hash chain */
  var bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head;          /* head of hash chain */
  var bflush;              /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush;            /* set if current block must be flushed */
  var prev;              /* byte at distance one to match */
  var scan, strend;      /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new utils.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;          /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;      /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH;
  trees._tr_init(s);
  return Z_OK;
}


function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
}


function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
  strm.state.gzhead = head;
  return Z_OK;
}


function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;
  s.pending_buf = new utils.Buf8(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}


function deflate(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {

    if (s.wrap === 2) { // GZIP header
      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) { // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      }
      else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    else // DEFLATE header
    {
      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s.strstart !== 0) { header |= PRESET_DICT; }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }

//#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    }
    else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    }
    else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    }
    else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    }
    else {
      s.status = BUSY_STATE;
    }
  }
//#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      }
      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH) { return Z_OK; }
  if (s.wrap <= 0) { return Z_STREAM_END; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  status = strm.state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  s = strm.state;
  wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    tmpDict = new utils.Buf8(s.w_size);
    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}


exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/


/***/ }),

/***/ 5105:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

module.exports = GZheader;


/***/ }),

/***/ 5349:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
var BAD = 30;       /* got a data error -- remain here until reset */
var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
module.exports = function inflate_fast(strm, start) {
  var state;
  var _in;                    /* local strm.input */
  var last;                   /* have enough input while in < last */
  var _out;                   /* local strm.output */
  var beg;                    /* inflate()'s initial strm.output */
  var end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  var dmax;                   /* maximum distance from zlib header */
//#endif
  var wsize;                  /* window size or zero if not using window */
  var whave;                  /* valid bytes in the window */
  var wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  var s_window;               /* allocated sliding window, if wsize != 0 */
  var hold;                   /* local strm.hold */
  var bits;                   /* local strm.bits */
  var lcode;                  /* local strm.lencode */
  var dcode;                  /* local strm.distcode */
  var lmask;                  /* mask for first level of length codes */
  var dmask;                  /* mask for first level of distance codes */
  var here;                   /* retrieved table entry */
  var op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  var len;                    /* match length, unused bytes */
  var dist;                   /* match distance */
  var from;                   /* where to copy match from */
  var from_source;


  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};


/***/ }),

/***/ 409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils         = __nccwpck_require__(5483);
var adler32       = __nccwpck_require__(6924);
var crc32         = __nccwpck_require__(7242);
var inflate_fast  = __nccwpck_require__(5349);
var inflate_table = __nccwpck_require__(6895);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED  = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var    HEAD = 1;       /* i: waiting for magic header */
var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
var    TIME = 3;       /* i: waiting for modification time (gzip) */
var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
var    NAME = 7;       /* i: waiting for end of file name (gzip) */
var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
var    HCRC = 9;       /* i: waiting for header crc (gzip) */
var    DICTID = 10;    /* i: waiting for dictionary check value */
var    DICT = 11;      /* waiting for inflateSetDictionary() call */
var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
var        STORED = 14;    /* i: waiting for stored size (length and complement) */
var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
var        LENLENS = 18;   /* i: waiting for code length code lengths */
var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
var            LEN = 21;       /* i: waiting for length/lit/eob code */
var            LENEXT = 22;    /* i: waiting for length extra bits */
var            DIST = 23;      /* i: waiting for distance code */
var            DISTEXT = 24;   /* i: waiting for distance extra bits */
var            MATCH = 25;     /* o: waiting for output space to copy string */
var            LIT = 26;       /* o: waiting for output space to write literal */
var    CHECK = 27;     /* i: waiting for 32-bit check value */
var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
var    DONE = 29;      /* finished check, done -- remain here until reset */
var    BAD = 30;       /* got a data error -- remain here until reset */
var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_WBITS = MAX_WBITS;


function zswap32(q) {
  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
}


function InflateState() {
  this.mode = 0;             /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
  this.work = new utils.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) { return Z_STREAM_ERROR; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null/*Z_NULL*/;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new utils.Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      utils.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
}

function inflate(strm, flush) {
  var state;
  var input, output;          // input/output buffers
  var next;                   /* next input INDEX */
  var put;                    /* next output INDEX */
  var have, left;             /* available input and output */
  var hold;                   /* bit buffer */
  var bits;                   /* bits in bit buffer */
  var _in, _out;              /* save starting available input and output */
  var copy;                   /* number of stored or match bytes to copy */
  var from;                   /* where to copy match bytes from */
  var from_source;
  var here = 0;               /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len;                    /* length to copy for repeats, bits to drop */
  var ret;                    /* return code */
  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


  if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        state.flags = 0;           /* expect zlib header */
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        else if (len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }
        state.dmax = 1 << len;
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Array(state.head.extra_len);
              }
              utils.arraySet(
                state.head.extra,
                input,
                next,
                // extra field is limited to 65536 bytes
                // - no need for additional size check
                copy,
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          utils.arraySet(output, input, next, copy, put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inflate_fast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if (_out) {
            strm.adler = state.check =
                /*UPDATE(state.check, put - _out, _out);*/
                (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
    return Z_STREAM_ERROR;
  }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;

  /* check state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK;
}

function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var state;
  var dictid;
  var ret;

  /* check state */
  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK;
}

exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/


/***/ }),

/***/ 6895:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils = __nccwpck_require__(5483);

var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

var lbase = [ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

var lext = [ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];

var dbase = [ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
];

module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
{
  var bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  var len = 0;               /* a code's length in bits */
  var sym = 0;               /* index of code symbols */
  var min = 0, max = 0;          /* minimum and maximum code lengths */
  var root = 0;              /* number of index bits for root table */
  var curr = 0;              /* number of index bits for current table */
  var drop = 0;              /* code bits to drop for sub-table */
  var left = 0;                   /* number of prefix codes available */
  var used = 0;              /* code entries in table used */
  var huff = 0;              /* Huffman code */
  var incr;              /* for incrementing code, index */
  var fill;              /* index for replicating entries */
  var low;               /* low bits for current root entry */
  var mask;              /* mask for low root bits */
  var next;             /* next available space in table */
  var base = null;     /* base value table to use */
  var base_index = 0;
//  var shoextra;    /* extra bits table to use */
  var end;                    /* use base and extra for symbol > end */
  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work;    /* dummy value--not used */
    end = 19;

  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


/***/ }),

/***/ 1890:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};


/***/ }),

/***/ 8754:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

var utils = __nccwpck_require__(5483);

/* Public constants ==========================================================*/
/* ===========================================================================*/


//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED               = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY              = 0;
var Z_TEXT                = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;

/*============================================================================*/


function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES    = 2;
/* The three kinds of block type */

var MIN_MATCH    = 3;
var MAX_MATCH    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS      = 256;
/* number of literal bytes 0..255 */

var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES       = 30;
/* number of distance codes */

var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */

var MAX_BITS      = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK   = 256;
/* end of block literal code */

var REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits =   /* extra bits for each length code */
  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

var extra_dbits =   /* extra bits for each distance code */
  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

var extra_blbits =  /* extra bits for each bit length code */
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

var bl_order =
  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
var static_ltree  = new Array((L_CODES + 2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree  = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code    = new Array(DIST_CODE_LEN);
zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length   = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist     = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


var static_l_desc;
var static_d_desc;
var static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short(s, w) {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}


function send_code(s, c, tree) {
  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
}


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree            = desc.dyn_tree;
  var max_code        = desc.max_code;
  var stree           = desc.stat_desc.static_tree;
  var has_stree       = desc.stat_desc.has_stree;
  var extra           = desc.stat_desc.extra_bits;
  var base            = desc.stat_desc.extra_base;
  var max_length      = desc.stat_desc.max_length;
  var h;              /* heap index */
  var n, m;           /* iterate over the tree elements */
  var bits;           /* bit length */
  var xbits;          /* extra bits */
  var f;              /* frequency */
  var overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
}


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
  var code = 0;              /* running code value */
  var bits;                  /* bit index */
  var n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    var len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n;        /* iterates over tree elements */
  var bits;     /* bit counter */
  var length;   /* length value */
  var code;     /* code value */
  var dist;     /* distance index */
  var bl_count = new Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

  //static_init_done = true;
}


/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s)
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header)
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s);        /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
//  while (len--) {
//    put_byte(s, *buf++);
//  }
  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}


// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist;           /* distance of matched string */
  var lc;             /* match length or unmatched char (if dist == 0) */
  var lx = 0;         /* running index in l_buf */
  var code;           /* the code to send */
  var extra;          /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree     = desc.dyn_tree;
  var stree    = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems    = desc.stat_desc.elems;
  var n, m;          /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
}


var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s)
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}


/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  var max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility

//#ifdef TRUNCATE_BLOCK
//  /* Try to guess if it is profitable to stop the current block here */
//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
//    /* Compute an upper bound for the compressed length */
//    out_length = s.last_lit*8;
//    in_length = s.strstart - s.block_start;
//
//    for (dcode = 0; dcode < D_CODES; dcode++) {
//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
//    }
//    out_length >>>= 3;
//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
//    //       s->last_lit, in_length, out_length,
//    //       100L - out_length*100L/in_length));
//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
//      return true;
//    }
//  }
//#endif

  return (s.last_lit === s.lit_bufsize - 1);
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

exports._tr_init  = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block  = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;


/***/ }),

/***/ 6442:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

module.exports = ZStream;


/***/ }),

/***/ 8714:
/***/ ((module) => {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 4810:
/***/ ((module) => {

"use strict";


const processFn = (fn, options) => function (...args) {
	const P = options.promiseModule;

	return new P((resolve, reject) => {
		if (options.multiArgs) {
			args.push((...result) => {
				if (options.errorFirst) {
					if (result[0]) {
						reject(result);
					} else {
						result.shift();
						resolve(result);
					}
				} else {
					resolve(result);
				}
			});
		} else if (options.errorFirst) {
			args.push((error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		} else {
			args.push(resolve);
		}

		fn.apply(this, args);
	});
};

module.exports = (input, options) => {
	options = Object.assign({
		exclude: [/.+(Sync|Stream)$/],
		errorFirst: true,
		promiseModule: Promise
	}, options);

	const objType = typeof input;
	if (!(input !== null && (objType === 'object' || objType === 'function'))) {
		throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? 'null' : objType}\``);
	}

	const filter = key => {
		const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);
		return options.include ? options.include.some(match) : !options.exclude.some(match);
	};

	let ret;
	if (objType === 'function') {
		ret = function (...args) {
			return options.excludeMain ? input(...args) : processFn(input, options).apply(this, args);
		};
	} else {
		ret = Object.create(Object.getPrototypeOf(input));
	}

	for (const key in input) { // eslint-disable-line guard-for-in
		const property = input[key];
		ret[key] = typeof property === 'function' && filter(key) ? processFn(property, options) : property;
	}

	return ret;
};


/***/ }),

/***/ 1867:
/***/ ((module, exports, __nccwpck_require__) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = __nccwpck_require__(4300)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ 3251:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Buffer = (__nccwpck_require__(1867).Buffer)

// prototype class for hash functions
function Hash (blockSize, finalSize) {
  this._block = Buffer.alloc(blockSize)
  this._finalSize = finalSize
  this._blockSize = blockSize
  this._len = 0
}

Hash.prototype.update = function (data, enc) {
  if (typeof data === 'string') {
    enc = enc || 'utf8'
    data = Buffer.from(data, enc)
  }

  var block = this._block
  var blockSize = this._blockSize
  var length = data.length
  var accum = this._len

  for (var offset = 0; offset < length;) {
    var assigned = accum % blockSize
    var remainder = Math.min(length - offset, blockSize - assigned)

    for (var i = 0; i < remainder; i++) {
      block[assigned + i] = data[offset + i]
    }

    accum += remainder
    offset += remainder

    if ((accum % blockSize) === 0) {
      this._update(block)
    }
  }

  this._len += length
  return this
}

Hash.prototype.digest = function (enc) {
  var rem = this._len % this._blockSize

  this._block[rem] = 0x80

  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
  this._block.fill(0, rem + 1)

  if (rem >= this._finalSize) {
    this._update(this._block)
    this._block.fill(0)
  }

  var bits = this._len * 8

  // uint32
  if (bits <= 0xffffffff) {
    this._block.writeUInt32BE(bits, this._blockSize - 4)

  // uint64
  } else {
    var lowBits = (bits & 0xffffffff) >>> 0
    var highBits = (bits - lowBits) / 0x100000000

    this._block.writeUInt32BE(highBits, this._blockSize - 8)
    this._block.writeUInt32BE(lowBits, this._blockSize - 4)
  }

  this._update(this._block)
  var hash = this._hash()

  return enc ? hash.toString(enc) : hash
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

module.exports = Hash


/***/ }),

/***/ 2398:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = __nccwpck_require__(4124)
var Hash = __nccwpck_require__(3251)
var Buffer = (__nccwpck_require__(1867).Buffer)

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha1 () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl1 (num) {
  return (num << 1) | (num >>> 31)
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha1.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha1


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 4300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 5114:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var AsyncLock = _interopDefault(__nccwpck_require__(1542));
var Hash = _interopDefault(__nccwpck_require__(2398));
var crc32 = _interopDefault(__nccwpck_require__(3201));
var pako = _interopDefault(__nccwpck_require__(1726));
var ignore = _interopDefault(__nccwpck_require__(1230));
var pify = _interopDefault(__nccwpck_require__(4810));
var cleanGitRef = _interopDefault(__nccwpck_require__(3268));
var diff3Merge = _interopDefault(__nccwpck_require__(5211));

/**
 * @typedef {Object} GitProgressEvent
 * @property {string} phase
 * @property {number} loaded
 * @property {number} total
 */

/**
 * @callback ProgressCallback
 * @param {GitProgressEvent} progress
 * @returns {void | Promise<void>}
 */

/**
 * @typedef {Object} GitHttpRequest
 * @property {string} url - The URL to request
 * @property {string} [method='GET'] - The HTTP method to use
 * @property {Object<string, string>} [headers={}] - Headers to include in the HTTP request
 * @property {Object} [agent] - An HTTP or HTTPS agent that manages connections for the HTTP client (Node.js only)
 * @property {AsyncIterableIterator<Uint8Array>} [body] - An async iterator of Uint8Arrays that make up the body of POST requests
 * @property {ProgressCallback} [onProgress] - Reserved for future use (emitting `GitProgressEvent`s)
 * @property {object} [signal] - Reserved for future use (canceling a request)
 */

/**
 * @typedef {Object} GitHttpResponse
 * @property {string} url - The final URL that was fetched after any redirects
 * @property {string} [method] - The HTTP method that was used
 * @property {Object<string, string>} [headers] - HTTP response headers
 * @property {AsyncIterableIterator<Uint8Array>} [body] - An async iterator of Uint8Arrays that make up the body of the response
 * @property {number} statusCode - The HTTP status code
 * @property {string} statusMessage - The HTTP status message
 */

/**
 * @callback HttpFetch
 * @param {GitHttpRequest} request
 * @returns {Promise<GitHttpResponse>}
 */

/**
 * @typedef {Object} HttpClient
 * @property {HttpFetch} request
 */

/**
 * A git commit object.
 *
 * @typedef {Object} CommitObject
 * @property {string} message Commit message
 * @property {string} tree SHA-1 object id of corresponding file tree
 * @property {string[]} parent an array of zero or more SHA-1 object ids
 * @property {Object} author
 * @property {string} author.name The author's name
 * @property {string} author.email The author's email
 * @property {number} author.timestamp UTC Unix timestamp in seconds
 * @property {number} author.timezoneOffset Timezone difference from UTC in minutes
 * @property {Object} committer
 * @property {string} committer.name The committer's name
 * @property {string} committer.email The committer's email
 * @property {number} committer.timestamp UTC Unix timestamp in seconds
 * @property {number} committer.timezoneOffset Timezone difference from UTC in minutes
 * @property {string} [gpgsig] PGP signature (if present)
 */

/**
 * An entry from a git tree object. Files are called 'blobs' and directories are called 'trees'.
 *
 * @typedef {Object} TreeEntry
 * @property {string} mode the 6 digit hexadecimal mode
 * @property {string} path the name of the file or directory
 * @property {string} oid the SHA-1 object id of the blob or tree
 * @property {'commit'|'blob'|'tree'} type the type of object
 */

/**
 * A git tree object. Trees represent a directory snapshot.
 *
 * @typedef {TreeEntry[]} TreeObject
 */

/**
 * A git annotated tag object.
 *
 * @typedef {Object} TagObject
 * @property {string} object SHA-1 object id of object being tagged
 * @property {'blob' | 'tree' | 'commit' | 'tag'} type the type of the object being tagged
 * @property {string} tag the tag name
 * @property {Object} tagger
 * @property {string} tagger.name the tagger's name
 * @property {string} tagger.email the tagger's email
 * @property {number} tagger.timestamp UTC Unix timestamp in seconds
 * @property {number} tagger.timezoneOffset timezone difference from UTC in minutes
 * @property {string} message tag message
 * @property {string} [gpgsig] PGP signature (if present)
 */

/**
 * @typedef {Object} ReadCommitResult
 * @property {string} oid - SHA-1 object id of this commit
 * @property {CommitObject} commit - the parsed commit object
 * @property {string} payload - PGP signing payload
 */

/**
 * @typedef {Object} ServerRef - This object has the following schema:
 * @property {string} ref - The name of the ref
 * @property {string} oid - The SHA-1 object id the ref points to
 * @property {string} [target] - The target ref pointed to by a symbolic ref
 * @property {string} [peeled] - If the oid is the SHA-1 object id of an annotated tag, this is the SHA-1 object id that the annotated tag points to
 */

/**
 * @typedef Walker
 * @property {Symbol} Symbol('GitWalkerSymbol')
 */

/**
 * Normalized subset of filesystem `stat` data:
 *
 * @typedef {Object} Stat
 * @property {number} ctimeSeconds
 * @property {number} ctimeNanoseconds
 * @property {number} mtimeSeconds
 * @property {number} mtimeNanoseconds
 * @property {number} dev
 * @property {number} ino
 * @property {number} mode
 * @property {number} uid
 * @property {number} gid
 * @property {number} size
 */

/**
 * The `WalkerEntry` is an interface that abstracts computing many common tree / blob stats.
 *
 * @typedef {Object} WalkerEntry
 * @property {function(): Promise<'tree'|'blob'|'special'|'commit'>} type
 * @property {function(): Promise<number>} mode
 * @property {function(): Promise<string>} oid
 * @property {function(): Promise<Uint8Array|void>} content
 * @property {function(): Promise<Stat>} stat
 */

/**
 * @typedef {Object} CallbackFsClient
 * @property {function} readFile - https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
 * @property {function} writeFile - https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
 * @property {function} unlink - https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback
 * @property {function} readdir - https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
 * @property {function} mkdir - https://nodejs.org/api/fs.html#fs_fs_mkdir_path_mode_callback
 * @property {function} rmdir - https://nodejs.org/api/fs.html#fs_fs_rmdir_path_callback
 * @property {function} stat - https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback
 * @property {function} lstat - https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback
 * @property {function} [readlink] - https://nodejs.org/api/fs.html#fs_fs_readlink_path_options_callback
 * @property {function} [symlink] - https://nodejs.org/api/fs.html#fs_fs_symlink_target_path_type_callback
 * @property {function} [chmod] - https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback
 */

/**
 * @typedef {Object} PromiseFsClient
 * @property {Object} promises
 * @property {function} promises.readFile - https://nodejs.org/api/fs.html#fs_fspromises_readfile_path_options
 * @property {function} promises.writeFile - https://nodejs.org/api/fs.html#fs_fspromises_writefile_file_data_options
 * @property {function} promises.unlink - https://nodejs.org/api/fs.html#fs_fspromises_unlink_path
 * @property {function} promises.readdir - https://nodejs.org/api/fs.html#fs_fspromises_readdir_path_options
 * @property {function} promises.mkdir - https://nodejs.org/api/fs.html#fs_fspromises_mkdir_path_options
 * @property {function} promises.rmdir - https://nodejs.org/api/fs.html#fs_fspromises_rmdir_path
 * @property {function} promises.stat - https://nodejs.org/api/fs.html#fs_fspromises_stat_path_options
 * @property {function} promises.lstat - https://nodejs.org/api/fs.html#fs_fspromises_lstat_path_options
 * @property {function} [promises.readlink] - https://nodejs.org/api/fs.html#fs_fspromises_readlink_path_options
 * @property {function} [promises.symlink] - https://nodejs.org/api/fs.html#fs_fspromises_symlink_target_path_type
 * @property {function} [promises.chmod] - https://nodejs.org/api/fs.html#fs_fspromises_chmod_path_mode
 */

/**
 * @typedef {CallbackFsClient | PromiseFsClient} FsClient
 */

/**
 * @callback MessageCallback
 * @param {string} message
 * @returns {void | Promise<void>}
 */

/**
 * @typedef {Object} GitAuth
 * @property {string} [username]
 * @property {string} [password]
 * @property {Object<string, string>} [headers]
 * @property {boolean} [cancel] Tells git to throw a `UserCanceledError` (instead of an `HttpError`).
 */

/**
 * @callback AuthCallback
 * @param {string} url
 * @param {GitAuth} auth Might have some values if the URL itself originally contained a username or password.
 * @returns {GitAuth | void | Promise<GitAuth | void>}
 */

/**
 * @callback AuthFailureCallback
 * @param {string} url
 * @param {GitAuth} auth The credentials that failed
 * @returns {GitAuth | void | Promise<GitAuth | void>}
 */

/**
 * @callback AuthSuccessCallback
 * @param {string} url
 * @param {GitAuth} auth
 * @returns {void | Promise<void>}
 */

/**
 * @typedef {Object} SignParams
 * @property {string} payload - a plaintext message
 * @property {string} secretKey - an 'ASCII armor' encoded PGP key (technically can actually contain _multiple_ keys)
 */

/**
 * @callback SignCallback
 * @param {SignParams} args
 * @return {{signature: string} | Promise<{signature: string}>} - an 'ASCII armor' encoded "detached" signature
 */

/**
 * @typedef {Object} MergeDriverParams
 * @property {Array<string>} branches
 * @property {Array<string>} contents
 * @property {string} path
 */

/**
 * @callback MergeDriverCallback
 * @param {MergeDriverParams} args
 * @return {{cleanMerge: boolean, mergedText: string} | Promise<{cleanMerge: boolean, mergedText: string}>}
 */

/**
 * @callback WalkerMap
 * @param {string} filename
 * @param {WalkerEntry[]} entries
 * @returns {Promise<any>}
 */

/**
 * @callback WalkerReduce
 * @param {any} parent
 * @param {any[]} children
 * @returns {Promise<any>}
 */

/**
 * @callback WalkerIterateCallback
 * @param {WalkerEntry[]} entries
 * @returns {Promise<any[]>}
 */

/**
 * @callback WalkerIterate
 * @param {WalkerIterateCallback} walk
 * @param {IterableIterator<WalkerEntry[]>} children
 * @returns {Promise<any[]>}
 */

/**
 * @typedef {Object} RefUpdateStatus
 * @property {boolean} ok
 * @property {string} error
 */

/**
 * @typedef {Object} PushResult
 * @property {boolean} ok
 * @property {?string} error
 * @property {Object<string, RefUpdateStatus>} refs
 * @property {Object<string, string>} [headers]
 */

/**
 * @typedef {0|1} HeadStatus
 */

/**
 * @typedef {0|1|2} WorkdirStatus
 */

/**
 * @typedef {0|1|2|3} StageStatus
 */

/**
 * @typedef {[string, HeadStatus, WorkdirStatus, StageStatus]} StatusRow
 */

class BaseError extends Error {
  constructor(message) {
    super(message);
    // Setting this here allows TS to infer that all git errors have a `caller` property and
    // that its type is string.
    this.caller = '';
  }

  toJSON() {
    // Error objects aren't normally serializable. So we do something about that.
    return {
      code: this.code,
      data: this.data,
      caller: this.caller,
      message: this.message,
      stack: this.stack,
    }
  }

  fromJSON(json) {
    const e = new BaseError(json.message);
    e.code = json.code;
    e.data = json.data;
    e.caller = json.caller;
    e.stack = json.stack;
    return e
  }

  get isIsomorphicGitError() {
    return true
  }
}

class InternalError extends BaseError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(
      `An internal error caused this command to fail. Please file a bug report at https://github.com/isomorphic-git/isomorphic-git/issues with this error message: ${message}`
    );
    this.code = this.name = InternalError.code;
    this.data = { message };
  }
}
/** @type {'InternalError'} */
InternalError.code = 'InternalError';

class UnsafeFilepathError extends BaseError {
  /**
   * @param {string} filepath
   */
  constructor(filepath) {
    super(`The filepath "${filepath}" contains unsafe character sequences`);
    this.code = this.name = UnsafeFilepathError.code;
    this.data = { filepath };
  }
}
/** @type {'UnsafeFilepathError'} */
UnsafeFilepathError.code = 'UnsafeFilepathError';

// Modeled after https://github.com/tjfontaine/node-buffercursor
// but with the goal of being much lighter weight.
class BufferCursor {
  constructor(buffer) {
    this.buffer = buffer;
    this._start = 0;
  }

  eof() {
    return this._start >= this.buffer.length
  }

  tell() {
    return this._start
  }

  seek(n) {
    this._start = n;
  }

  slice(n) {
    const r = this.buffer.slice(this._start, this._start + n);
    this._start += n;
    return r
  }

  toString(enc, length) {
    const r = this.buffer.toString(enc, this._start, this._start + length);
    this._start += length;
    return r
  }

  write(value, length, enc) {
    const r = this.buffer.write(value, this._start, length, enc);
    this._start += length;
    return r
  }

  copy(source, start, end) {
    const r = source.copy(this.buffer, this._start, start, end);
    this._start += r;
    return r
  }

  readUInt8() {
    const r = this.buffer.readUInt8(this._start);
    this._start += 1;
    return r
  }

  writeUInt8(value) {
    const r = this.buffer.writeUInt8(value, this._start);
    this._start += 1;
    return r
  }

  readUInt16BE() {
    const r = this.buffer.readUInt16BE(this._start);
    this._start += 2;
    return r
  }

  writeUInt16BE(value) {
    const r = this.buffer.writeUInt16BE(value, this._start);
    this._start += 2;
    return r
  }

  readUInt32BE() {
    const r = this.buffer.readUInt32BE(this._start);
    this._start += 4;
    return r
  }

  writeUInt32BE(value) {
    const r = this.buffer.writeUInt32BE(value, this._start);
    this._start += 4;
    return r
  }
}

function compareStrings(a, b) {
  // https://stackoverflow.com/a/40355107/2168416
  return -(a < b) || +(a > b)
}

function comparePath(a, b) {
  // https://stackoverflow.com/a/40355107/2168416
  return compareStrings(a.path, b.path)
}

/**
 * From https://github.com/git/git/blob/master/Documentation/technical/index-format.txt
 *
 * 32-bit mode, split into (high to low bits)
 *
 *  4-bit object type
 *    valid values in binary are 1000 (regular file), 1010 (symbolic link)
 *    and 1110 (gitlink)
 *
 *  3-bit unused
 *
 *  9-bit unix permission. Only 0755 and 0644 are valid for regular files.
 *  Symbolic links and gitlinks have value 0 in this field.
 */
function normalizeMode(mode) {
  // Note: BrowserFS will use -1 for "unknown"
  // I need to make it non-negative for these bitshifts to work.
  let type = mode > 0 ? mode >> 12 : 0;
  // If it isn't valid, assume it as a "regular file"
  // 0100 = directory
  // 1000 = regular file
  // 1010 = symlink
  // 1110 = gitlink
  if (
    type !== 0b0100 &&
    type !== 0b1000 &&
    type !== 0b1010 &&
    type !== 0b1110
  ) {
    type = 0b1000;
  }
  let permissions = mode & 0o777;
  // Is the file executable? then 755. Else 644.
  if (permissions & 0b001001001) {
    permissions = 0o755;
  } else {
    permissions = 0o644;
  }
  // If it's not a regular file, scrub all permissions
  if (type !== 0b1000) permissions = 0;
  return (type << 12) + permissions
}

const MAX_UINT32 = 2 ** 32;

function SecondsNanoseconds(
  givenSeconds,
  givenNanoseconds,
  milliseconds,
  date
) {
  if (givenSeconds !== undefined && givenNanoseconds !== undefined) {
    return [givenSeconds, givenNanoseconds]
  }
  if (milliseconds === undefined) {
    milliseconds = date.valueOf();
  }
  const seconds = Math.floor(milliseconds / 1000);
  const nanoseconds = (milliseconds - seconds * 1000) * 1000000;
  return [seconds, nanoseconds]
}

function normalizeStats(e) {
  const [ctimeSeconds, ctimeNanoseconds] = SecondsNanoseconds(
    e.ctimeSeconds,
    e.ctimeNanoseconds,
    e.ctimeMs,
    e.ctime
  );
  const [mtimeSeconds, mtimeNanoseconds] = SecondsNanoseconds(
    e.mtimeSeconds,
    e.mtimeNanoseconds,
    e.mtimeMs,
    e.mtime
  );

  return {
    ctimeSeconds: ctimeSeconds % MAX_UINT32,
    ctimeNanoseconds: ctimeNanoseconds % MAX_UINT32,
    mtimeSeconds: mtimeSeconds % MAX_UINT32,
    mtimeNanoseconds: mtimeNanoseconds % MAX_UINT32,
    dev: e.dev % MAX_UINT32,
    ino: e.ino % MAX_UINT32,
    mode: normalizeMode(e.mode % MAX_UINT32),
    uid: e.uid % MAX_UINT32,
    gid: e.gid % MAX_UINT32,
    // size of -1 happens over a BrowserFS HTTP Backend that doesn't serve Content-Length headers
    // (like the Karma webserver) because BrowserFS HTTP Backend uses HTTP HEAD requests to do fs.stat
    size: e.size > -1 ? e.size % MAX_UINT32 : 0,
  }
}

function toHex(buffer) {
  let hex = '';
  for (const byte of new Uint8Array(buffer)) {
    if (byte < 16) hex += '0';
    hex += byte.toString(16);
  }
  return hex
}

/* eslint-env node, browser */

let supportsSubtleSHA1 = null;

async function shasum(buffer) {
  if (supportsSubtleSHA1 === null) {
    supportsSubtleSHA1 = await testSubtleSHA1();
  }
  return supportsSubtleSHA1 ? subtleSHA1(buffer) : shasumSync(buffer)
}

// This is modeled after @dominictarr's "shasum" module,
// but without the 'json-stable-stringify' dependency and
// extra type-casting features.
function shasumSync(buffer) {
  return new Hash().update(buffer).digest('hex')
}

async function subtleSHA1(buffer) {
  const hash = await crypto.subtle.digest('SHA-1', buffer);
  return toHex(hash)
}

async function testSubtleSHA1() {
  // I'm using a rather crude method of progressive enhancement, because
  // some browsers that have crypto.subtle.digest don't actually implement SHA-1.
  try {
    const hash = await subtleSHA1(new Uint8Array([]));
    if (hash === 'da39a3ee5e6b4b0d3255bfef95601890afd80709') return true
  } catch (_) {
    // no bother
  }
  return false
}

// Extract 1-bit assume-valid, 1-bit extended flag, 2-bit merge state flag, 12-bit path length flag
function parseCacheEntryFlags(bits) {
  return {
    assumeValid: Boolean(bits & 0b1000000000000000),
    extended: Boolean(bits & 0b0100000000000000),
    stage: (bits & 0b0011000000000000) >> 12,
    nameLength: bits & 0b0000111111111111,
  }
}

function renderCacheEntryFlags(entry) {
  const flags = entry.flags;
  // 1-bit extended flag (must be zero in version 2)
  flags.extended = false;
  // 12-bit name length if the length is less than 0xFFF; otherwise 0xFFF
  // is stored in this field.
  flags.nameLength = Math.min(Buffer.from(entry.path).length, 0xfff);
  return (
    (flags.assumeValid ? 0b1000000000000000 : 0) +
    (flags.extended ? 0b0100000000000000 : 0) +
    ((flags.stage & 0b11) << 12) +
    (flags.nameLength & 0b111111111111)
  )
}

class GitIndex {
  /*::
   _entries: Map<string, CacheEntry>
   _dirty: boolean // Used to determine if index needs to be saved to filesystem
   */
  constructor(entries) {
    this._dirty = false;
    this._entries = entries || new Map();
  }

  static async from(buffer) {
    if (Buffer.isBuffer(buffer)) {
      return GitIndex.fromBuffer(buffer)
    } else if (buffer === null) {
      return new GitIndex(null)
    } else {
      throw new InternalError('invalid type passed to GitIndex.from')
    }
  }

  static async fromBuffer(buffer) {
    // Verify shasum
    const shaComputed = await shasum(buffer.slice(0, -20));
    const shaClaimed = buffer.slice(-20).toString('hex');
    if (shaClaimed !== shaComputed) {
      throw new InternalError(
        `Invalid checksum in GitIndex buffer: expected ${shaClaimed} but saw ${shaComputed}`
      )
    }
    const reader = new BufferCursor(buffer);
    const _entries = new Map();
    const magic = reader.toString('utf8', 4);
    if (magic !== 'DIRC') {
      throw new InternalError(`Inavlid dircache magic file number: ${magic}`)
    }
    const version = reader.readUInt32BE();
    if (version !== 2) {
      throw new InternalError(`Unsupported dircache version: ${version}`)
    }
    const numEntries = reader.readUInt32BE();
    let i = 0;
    while (!reader.eof() && i < numEntries) {
      const entry = {};
      entry.ctimeSeconds = reader.readUInt32BE();
      entry.ctimeNanoseconds = reader.readUInt32BE();
      entry.mtimeSeconds = reader.readUInt32BE();
      entry.mtimeNanoseconds = reader.readUInt32BE();
      entry.dev = reader.readUInt32BE();
      entry.ino = reader.readUInt32BE();
      entry.mode = reader.readUInt32BE();
      entry.uid = reader.readUInt32BE();
      entry.gid = reader.readUInt32BE();
      entry.size = reader.readUInt32BE();
      entry.oid = reader.slice(20).toString('hex');
      const flags = reader.readUInt16BE();
      entry.flags = parseCacheEntryFlags(flags);
      // TODO: handle if (version === 3 && entry.flags.extended)
      const pathlength = buffer.indexOf(0, reader.tell() + 1) - reader.tell();
      if (pathlength < 1) {
        throw new InternalError(`Got a path length of: ${pathlength}`)
      }
      // TODO: handle pathnames larger than 12 bits
      entry.path = reader.toString('utf8', pathlength);

      // Prevent malicious paths like "..\foo"
      if (entry.path.includes('..\\') || entry.path.includes('../')) {
        throw new UnsafeFilepathError(entry.path)
      }

      // The next bit is awkward. We expect 1 to 8 null characters
      // such that the total size of the entry is a multiple of 8 bits.
      // (Hence subtract 12 bytes for the header.)
      let padding = 8 - ((reader.tell() - 12) % 8);
      if (padding === 0) padding = 8;
      while (padding--) {
        const tmp = reader.readUInt8();
        if (tmp !== 0) {
          throw new InternalError(
            `Expected 1-8 null characters but got '${tmp}' after ${entry.path}`
          )
        } else if (reader.eof()) {
          throw new InternalError('Unexpected end of file')
        }
      }
      // end of awkward part
      _entries.set(entry.path, entry);
      i++;
    }
    return new GitIndex(_entries)
  }

  get entries() {
    return [...this._entries.values()].sort(comparePath)
  }

  get entriesMap() {
    return this._entries
  }

  *[Symbol.iterator]() {
    for (const entry of this.entries) {
      yield entry;
    }
  }

  insert({ filepath, stats, oid }) {
    stats = normalizeStats(stats);
    const bfilepath = Buffer.from(filepath);
    const entry = {
      ctimeSeconds: stats.ctimeSeconds,
      ctimeNanoseconds: stats.ctimeNanoseconds,
      mtimeSeconds: stats.mtimeSeconds,
      mtimeNanoseconds: stats.mtimeNanoseconds,
      dev: stats.dev,
      ino: stats.ino,
      // We provide a fallback value for `mode` here because not all fs
      // implementations assign it, but we use it in GitTree.
      // '100644' is for a "regular non-executable file"
      mode: stats.mode || 0o100644,
      uid: stats.uid,
      gid: stats.gid,
      size: stats.size,
      path: filepath,
      oid: oid,
      flags: {
        assumeValid: false,
        extended: false,
        stage: 0,
        nameLength: bfilepath.length < 0xfff ? bfilepath.length : 0xfff,
      },
    };
    this._entries.set(entry.path, entry);
    this._dirty = true;
  }

  delete({ filepath }) {
    if (this._entries.has(filepath)) {
      this._entries.delete(filepath);
    } else {
      for (const key of this._entries.keys()) {
        if (key.startsWith(filepath + '/')) {
          this._entries.delete(key);
        }
      }
    }
    this._dirty = true;
  }

  clear() {
    this._entries.clear();
    this._dirty = true;
  }

  has({ filepath }) {
    return this._entries.has(filepath)
  }

  render() {
    return this.entries
      .map(entry => `${entry.mode.toString(8)} ${entry.oid}    ${entry.path}`)
      .join('\n')
  }

  async toObject() {
    const header = Buffer.alloc(12);
    const writer = new BufferCursor(header);
    writer.write('DIRC', 4, 'utf8');
    writer.writeUInt32BE(2);
    writer.writeUInt32BE(this.entries.length);
    const body = Buffer.concat(
      this.entries.map(entry => {
        const bpath = Buffer.from(entry.path);
        // the fixed length + the filename + at least one null char => align by 8
        const length = Math.ceil((62 + bpath.length + 1) / 8) * 8;
        const written = Buffer.alloc(length);
        const writer = new BufferCursor(written);
        const stat = normalizeStats(entry);
        writer.writeUInt32BE(stat.ctimeSeconds);
        writer.writeUInt32BE(stat.ctimeNanoseconds);
        writer.writeUInt32BE(stat.mtimeSeconds);
        writer.writeUInt32BE(stat.mtimeNanoseconds);
        writer.writeUInt32BE(stat.dev);
        writer.writeUInt32BE(stat.ino);
        writer.writeUInt32BE(stat.mode);
        writer.writeUInt32BE(stat.uid);
        writer.writeUInt32BE(stat.gid);
        writer.writeUInt32BE(stat.size);
        writer.write(entry.oid, 20, 'hex');
        writer.writeUInt16BE(renderCacheEntryFlags(entry));
        writer.write(entry.path, bpath.length, 'utf8');
        return written
      })
    );
    const main = Buffer.concat([header, body]);
    const sum = await shasum(main);
    return Buffer.concat([main, Buffer.from(sum, 'hex')])
  }
}

function compareStats(entry, stats) {
  // Comparison based on the description in Paragraph 4 of
  // https://www.kernel.org/pub/software/scm/git/docs/technical/racy-git.txt
  const e = normalizeStats(entry);
  const s = normalizeStats(stats);
  const staleness =
    e.mode !== s.mode ||
    e.mtimeSeconds !== s.mtimeSeconds ||
    e.ctimeSeconds !== s.ctimeSeconds ||
    e.uid !== s.uid ||
    e.gid !== s.gid ||
    e.ino !== s.ino ||
    e.size !== s.size;
  return staleness
}

// import LockManager from 'travix-lock-manager'

// import Lock from '../utils.js'

// const lm = new LockManager()
let lock = null;

const IndexCache = Symbol('IndexCache');

function createCache() {
  return {
    map: new Map(),
    stats: new Map(),
  }
}

async function updateCachedIndexFile(fs, filepath, cache) {
  const stat = await fs.lstat(filepath);
  const rawIndexFile = await fs.read(filepath);
  const index = await GitIndex.from(rawIndexFile);
  // cache the GitIndex object so we don't need to re-read it every time.
  cache.map.set(filepath, index);
  // Save the stat data for the index so we know whether the cached file is stale (modified by an outside process).
  cache.stats.set(filepath, stat);
}

// Determine whether our copy of the index file is stale
async function isIndexStale(fs, filepath, cache) {
  const savedStats = cache.stats.get(filepath);
  if (savedStats === undefined) return true
  const currStats = await fs.lstat(filepath);
  if (savedStats === null) return false
  if (currStats === null) return false
  return compareStats(savedStats, currStats)
}

class GitIndexManager {
  /**
   *
   * @param {object} opts
   * @param {import('../models/FileSystem.js').FileSystem} opts.fs
   * @param {string} opts.gitdir
   * @param {object} opts.cache
   * @param {function(GitIndex): any} closure
   */
  static async acquire({ fs, gitdir, cache }, closure) {
    if (!cache[IndexCache]) cache[IndexCache] = createCache();

    const filepath = `${gitdir}/index`;
    if (lock === null) lock = new AsyncLock({ maxPending: Infinity });
    let result;
    await lock.acquire(filepath, async () => {
      // Acquire a file lock while we're reading the index
      // to make sure other processes aren't writing to it
      // simultaneously, which could result in a corrupted index.
      // const fileLock = await Lock(filepath)
      if (await isIndexStale(fs, filepath, cache[IndexCache])) {
        await updateCachedIndexFile(fs, filepath, cache[IndexCache]);
      }
      const index = cache[IndexCache].map.get(filepath);
      result = await closure(index);
      if (index._dirty) {
        // Acquire a file lock while we're writing the index file
        // let fileLock = await Lock(filepath)
        const buffer = await index.toObject();
        await fs.write(filepath, buffer);
        // Update cached stat value
        cache[IndexCache].stats.set(filepath, await fs.lstat(filepath));
        index._dirty = false;
      }
    });

    return result
  }
}

function basename(path) {
  const last = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  if (last > -1) {
    path = path.slice(last + 1);
  }
  return path
}

function dirname(path) {
  const last = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  if (last === -1) return '.'
  if (last === 0) return '/'
  return path.slice(0, last)
}

/*::
type Node = {
  type: string,
  fullpath: string,
  basename: string,
  metadata: Object, // mode, oid
  parent?: Node,
  children: Array<Node>
}
*/

function flatFileListToDirectoryStructure(files) {
  const inodes = new Map();
  const mkdir = function(name) {
    if (!inodes.has(name)) {
      const dir = {
        type: 'tree',
        fullpath: name,
        basename: basename(name),
        metadata: {},
        children: [],
      };
      inodes.set(name, dir);
      // This recursively generates any missing parent folders.
      // We do it after we've added the inode to the set so that
      // we don't recurse infinitely trying to create the root '.' dirname.
      dir.parent = mkdir(dirname(name));
      if (dir.parent && dir.parent !== dir) dir.parent.children.push(dir);
    }
    return inodes.get(name)
  };

  const mkfile = function(name, metadata) {
    if (!inodes.has(name)) {
      const file = {
        type: 'blob',
        fullpath: name,
        basename: basename(name),
        metadata: metadata,
        // This recursively generates any missing parent folders.
        parent: mkdir(dirname(name)),
        children: [],
      };
      if (file.parent) file.parent.children.push(file);
      inodes.set(name, file);
    }
    return inodes.get(name)
  };

  mkdir('.');
  for (const file of files) {
    mkfile(file.path, file);
  }
  return inodes
}

/**
 *
 * @param {number} mode
 */
function mode2type(mode) {
  // prettier-ignore
  switch (mode) {
    case 0o040000: return 'tree'
    case 0o100644: return 'blob'
    case 0o100755: return 'blob'
    case 0o120000: return 'blob'
    case 0o160000: return 'commit'
  }
  throw new InternalError(`Unexpected GitTree entry mode: ${mode.toString(8)}`)
}

class GitWalkerIndex {
  constructor({ fs, gitdir, cache }) {
    this.treePromise = GitIndexManager.acquire(
      { fs, gitdir, cache },
      async function(index) {
        return flatFileListToDirectoryStructure(index.entries)
      }
    );
    const walker = this;
    this.ConstructEntry = class StageEntry {
      constructor(fullpath) {
        this._fullpath = fullpath;
        this._type = false;
        this._mode = false;
        this._stat = false;
        this._oid = false;
      }

      async type() {
        return walker.type(this)
      }

      async mode() {
        return walker.mode(this)
      }

      async stat() {
        return walker.stat(this)
      }

      async content() {
        return walker.content(this)
      }

      async oid() {
        return walker.oid(this)
      }
    };
  }

  async readdir(entry) {
    const filepath = entry._fullpath;
    const tree = await this.treePromise;
    const inode = tree.get(filepath);
    if (!inode) return null
    if (inode.type === 'blob') return null
    if (inode.type !== 'tree') {
      throw new Error(`ENOTDIR: not a directory, scandir '${filepath}'`)
    }
    const names = inode.children.map(inode => inode.fullpath);
    names.sort(compareStrings);
    return names
  }

  async type(entry) {
    if (entry._type === false) {
      await entry.stat();
    }
    return entry._type
  }

  async mode(entry) {
    if (entry._mode === false) {
      await entry.stat();
    }
    return entry._mode
  }

  async stat(entry) {
    if (entry._stat === false) {
      const tree = await this.treePromise;
      const inode = tree.get(entry._fullpath);
      if (!inode) {
        throw new Error(
          `ENOENT: no such file or directory, lstat '${entry._fullpath}'`
        )
      }
      const stats = inode.type === 'tree' ? {} : normalizeStats(inode.metadata);
      entry._type = inode.type === 'tree' ? 'tree' : mode2type(stats.mode);
      entry._mode = stats.mode;
      if (inode.type === 'tree') {
        entry._stat = undefined;
      } else {
        entry._stat = stats;
      }
    }
    return entry._stat
  }

  async content(_entry) {
    // Cannot get content for an index entry
  }

  async oid(entry) {
    if (entry._oid === false) {
      const tree = await this.treePromise;
      const inode = tree.get(entry._fullpath);
      entry._oid = inode.metadata.oid;
    }
    return entry._oid
  }
}

// This is part of an elaborate system to facilitate code-splitting / tree-shaking.
// commands/walk.js can depend on only this, and the actual Walker classes exported
// can be opaque - only having a single property (this symbol) that is not enumerable,
// and thus the constructor can be passed as an argument to walk while being "unusable"
// outside of it.
const GitWalkSymbol = Symbol('GitWalkSymbol');

// @ts-check

/**
 * @returns {Walker}
 */
function STAGE() {
  const o = Object.create(null);
  Object.defineProperty(o, GitWalkSymbol, {
    value: function({ fs, gitdir, cache }) {
      return new GitWalkerIndex({ fs, gitdir, cache })
    },
  });
  Object.freeze(o);
  return o
}

// @ts-check

class NotFoundError extends BaseError {
  /**
   * @param {string} what
   */
  constructor(what) {
    super(`Could not find ${what}.`);
    this.code = this.name = NotFoundError.code;
    this.data = { what };
  }
}
/** @type {'NotFoundError'} */
NotFoundError.code = 'NotFoundError';

class ObjectTypeError extends BaseError {
  /**
   * @param {string} oid
   * @param {'blob'|'commit'|'tag'|'tree'} actual
   * @param {'blob'|'commit'|'tag'|'tree'} expected
   * @param {string} [filepath]
   */
  constructor(oid, actual, expected, filepath) {
    super(
      `Object ${oid} ${
        filepath ? `at ${filepath}` : ''
      }was anticipated to be a ${expected} but it is a ${actual}.`
    );
    this.code = this.name = ObjectTypeError.code;
    this.data = { oid, actual, expected, filepath };
  }
}
/** @type {'ObjectTypeError'} */
ObjectTypeError.code = 'ObjectTypeError';

class InvalidOidError extends BaseError {
  /**
   * @param {string} value
   */
  constructor(value) {
    super(`Expected a 40-char hex object id but saw "${value}".`);
    this.code = this.name = InvalidOidError.code;
    this.data = { value };
  }
}
/** @type {'InvalidOidError'} */
InvalidOidError.code = 'InvalidOidError';

class NoRefspecError extends BaseError {
  /**
   * @param {string} remote
   */
  constructor(remote) {
    super(`Could not find a fetch refspec for remote "${remote}". Make sure the config file has an entry like the following:
[remote "${remote}"]
\tfetch = +refs/heads/*:refs/remotes/origin/*
`);
    this.code = this.name = NoRefspecError.code;
    this.data = { remote };
  }
}
/** @type {'NoRefspecError'} */
NoRefspecError.code = 'NoRefspecError';

class GitPackedRefs {
  constructor(text) {
    this.refs = new Map();
    this.parsedConfig = [];
    if (text) {
      let key = null;
      this.parsedConfig = text
        .trim()
        .split('\n')
        .map(line => {
          if (/^\s*#/.test(line)) {
            return { line, comment: true }
          }
          const i = line.indexOf(' ');
          if (line.startsWith('^')) {
            // This is a oid for the commit associated with the annotated tag immediately preceding this line.
            // Trim off the '^'
            const value = line.slice(1);
            // The tagname^{} syntax is based on the output of `git show-ref --tags -d`
            this.refs.set(key + '^{}', value);
            return { line, ref: key, peeled: value }
          } else {
            // This is an oid followed by the ref name
            const value = line.slice(0, i);
            key = line.slice(i + 1);
            this.refs.set(key, value);
            return { line, ref: key, oid: value }
          }
        });
    }
    return this
  }

  static from(text) {
    return new GitPackedRefs(text)
  }

  delete(ref) {
    this.parsedConfig = this.parsedConfig.filter(entry => entry.ref !== ref);
    this.refs.delete(ref);
  }

  toString() {
    return this.parsedConfig.map(({ line }) => line).join('\n') + '\n'
  }
}

class GitRefSpec {
  constructor({ remotePath, localPath, force, matchPrefix }) {
    Object.assign(this, {
      remotePath,
      localPath,
      force,
      matchPrefix,
    });
  }

  static from(refspec) {
    const [
      forceMatch,
      remotePath,
      remoteGlobMatch,
      localPath,
      localGlobMatch,
    ] = refspec.match(/^(\+?)(.*?)(\*?):(.*?)(\*?)$/).slice(1);
    const force = forceMatch === '+';
    const remoteIsGlob = remoteGlobMatch === '*';
    const localIsGlob = localGlobMatch === '*';
    // validate
    // TODO: Make this check more nuanced, and depend on whether this is a fetch refspec or a push refspec
    if (remoteIsGlob !== localIsGlob) {
      throw new InternalError('Invalid refspec')
    }
    return new GitRefSpec({
      remotePath,
      localPath,
      force,
      matchPrefix: remoteIsGlob,
    })
    // TODO: We need to run resolveRef on both paths to expand them to their full name.
  }

  translate(remoteBranch) {
    if (this.matchPrefix) {
      if (remoteBranch.startsWith(this.remotePath)) {
        return this.localPath + remoteBranch.replace(this.remotePath, '')
      }
    } else {
      if (remoteBranch === this.remotePath) return this.localPath
    }
    return null
  }

  reverseTranslate(localBranch) {
    if (this.matchPrefix) {
      if (localBranch.startsWith(this.localPath)) {
        return this.remotePath + localBranch.replace(this.localPath, '')
      }
    } else {
      if (localBranch === this.localPath) return this.remotePath
    }
    return null
  }
}

class GitRefSpecSet {
  constructor(rules = []) {
    this.rules = rules;
  }

  static from(refspecs) {
    const rules = [];
    for (const refspec of refspecs) {
      rules.push(GitRefSpec.from(refspec)); // might throw
    }
    return new GitRefSpecSet(rules)
  }

  add(refspec) {
    const rule = GitRefSpec.from(refspec); // might throw
    this.rules.push(rule);
  }

  translate(remoteRefs) {
    const result = [];
    for (const rule of this.rules) {
      for (const remoteRef of remoteRefs) {
        const localRef = rule.translate(remoteRef);
        if (localRef) {
          result.push([remoteRef, localRef]);
        }
      }
    }
    return result
  }

  translateOne(remoteRef) {
    let result = null;
    for (const rule of this.rules) {
      const localRef = rule.translate(remoteRef);
      if (localRef) {
        result = localRef;
      }
    }
    return result
  }

  localNamespaces() {
    return this.rules
      .filter(rule => rule.matchPrefix)
      .map(rule => rule.localPath.replace(/\/$/, ''))
  }
}

function compareRefNames(a, b) {
  // https://stackoverflow.com/a/40355107/2168416
  const _a = a.replace(/\^\{\}$/, '');
  const _b = b.replace(/\^\{\}$/, '');
  const tmp = -(_a < _b) || +(_a > _b);
  if (tmp === 0) {
    return a.endsWith('^{}') ? 1 : -1
  }
  return tmp
}

function normalizePath(path) {
  return path
    .replace(/\/\.\//g, '/') // Replace '/./' with '/'
    .replace(/\/{2,}/g, '/') // Replace consecutive '/'
    .replace(/^\/\.$/, '/') // if path === '/.' return '/'
    .replace(/^\.\/$/, '.') // if path === './' return '.'
    .replace(/^\.\//, '') // Remove leading './'
    .replace(/\/\.$/, '') // Remove trailing '/.'
    .replace(/(.+)\/$/, '$1') // Remove trailing '/'
    .replace(/^$/, '.') // if path === '' return '.'
}

// For some reason path.posix.join is undefined in webpack

function join(...parts) {
  return normalizePath(parts.map(normalizePath).join('/'))
}

// This is straight from parse_unit_factor in config.c of canonical git
const num = val => {
  val = val.toLowerCase();
  let n = parseInt(val);
  if (val.endsWith('k')) n *= 1024;
  if (val.endsWith('m')) n *= 1024 * 1024;
  if (val.endsWith('g')) n *= 1024 * 1024 * 1024;
  return n
};

// This is straight from git_parse_maybe_bool_text in config.c of canonical git
const bool = val => {
  val = val.trim().toLowerCase();
  if (val === 'true' || val === 'yes' || val === 'on') return true
  if (val === 'false' || val === 'no' || val === 'off') return false
  throw Error(
    `Expected 'true', 'false', 'yes', 'no', 'on', or 'off', but got ${val}`
  )
};

const schema = {
  core: {
    filemode: bool,
    bare: bool,
    logallrefupdates: bool,
    symlinks: bool,
    ignorecase: bool,
    bigFileThreshold: num,
  },
};

// https://git-scm.com/docs/git-config#_syntax

// section starts with [ and ends with ]
// section is alphanumeric (ASCII) with - and .
// section is case insensitive
// subsection is optionnal
// subsection is specified after section and one or more spaces
// subsection is specified between double quotes
const SECTION_LINE_REGEX = /^\[([A-Za-z0-9-.]+)(?: "(.*)")?\]$/;
const SECTION_REGEX = /^[A-Za-z0-9-.]+$/;

// variable lines contain a name, and equal sign and then a value
// variable lines can also only contain a name (the implicit value is a boolean true)
// variable name is alphanumeric (ASCII) with -
// variable name starts with an alphabetic character
// variable name is case insensitive
const VARIABLE_LINE_REGEX = /^([A-Za-z][A-Za-z-]*)(?: *= *(.*))?$/;
const VARIABLE_NAME_REGEX = /^[A-Za-z][A-Za-z-]*$/;

const VARIABLE_VALUE_COMMENT_REGEX = /^(.*?)( *[#;].*)$/;

const extractSectionLine = line => {
  const matches = SECTION_LINE_REGEX.exec(line);
  if (matches != null) {
    const [section, subsection] = matches.slice(1);
    return [section, subsection]
  }
  return null
};

const extractVariableLine = line => {
  const matches = VARIABLE_LINE_REGEX.exec(line);
  if (matches != null) {
    const [name, rawValue = 'true'] = matches.slice(1);
    const valueWithoutComments = removeComments(rawValue);
    const valueWithoutQuotes = removeQuotes(valueWithoutComments);
    return [name, valueWithoutQuotes]
  }
  return null
};

const removeComments = rawValue => {
  const commentMatches = VARIABLE_VALUE_COMMENT_REGEX.exec(rawValue);
  if (commentMatches == null) {
    return rawValue
  }
  const [valueWithoutComment, comment] = commentMatches.slice(1);
  // if odd number of quotes before and after comment => comment is escaped
  if (
    hasOddNumberOfQuotes(valueWithoutComment) &&
    hasOddNumberOfQuotes(comment)
  ) {
    return `${valueWithoutComment}${comment}`
  }
  return valueWithoutComment
};

const hasOddNumberOfQuotes = text => {
  const numberOfQuotes = (text.match(/(?:^|[^\\])"/g) || []).length;
  return numberOfQuotes % 2 !== 0
};

const removeQuotes = text => {
  return text.split('').reduce((newText, c, idx, text) => {
    const isQuote = c === '"' && text[idx - 1] !== '\\';
    const isEscapeForQuote = c === '\\' && text[idx + 1] === '"';
    if (isQuote || isEscapeForQuote) {
      return newText
    }
    return newText + c
  }, '')
};

const lower = text => {
  return text != null ? text.toLowerCase() : null
};

const getPath = (section, subsection, name) => {
  return [lower(section), subsection, lower(name)]
    .filter(a => a != null)
    .join('.')
};

const normalizePath$1 = path => {
  const pathSegments = path.split('.');
  const section = pathSegments.shift();
  const name = pathSegments.pop();
  const subsection = pathSegments.length ? pathSegments.join('.') : undefined;

  return {
    section,
    subsection,
    name,
    path: getPath(section, subsection, name),
    sectionPath: getPath(section, subsection, null),
  }
};

const findLastIndex = (array, callback) => {
  return array.reduce((lastIndex, item, index) => {
    return callback(item) ? index : lastIndex
  }, -1)
};

// Note: there are a LOT of edge cases that aren't covered (e.g. keys in sections that also
// have subsections, [include] directives, etc.
class GitConfig {
  constructor(text) {
    let section = null;
    let subsection = null;
    this.parsedConfig = text.split('\n').map(line => {
      let name = null;
      let value = null;

      const trimmedLine = line.trim();
      const extractedSection = extractSectionLine(trimmedLine);
      const isSection = extractedSection != null;
      if (isSection) {
        ;[section, subsection] = extractedSection;
      } else {
        const extractedVariable = extractVariableLine(trimmedLine);
        const isVariable = extractedVariable != null;
        if (isVariable) {
          ;[name, value] = extractedVariable;
        }
      }

      const path = getPath(section, subsection, name);
      return { line, isSection, section, subsection, name, value, path }
    });
  }

  static from(text) {
    return new GitConfig(text)
  }

  async get(path, getall = false) {
    const normalizedPath = normalizePath$1(path).path;
    const allValues = this.parsedConfig
      .filter(config => config.path === normalizedPath)
      .map(({ section, name, value }) => {
        const fn = schema[section] && schema[section][name];
        return fn ? fn(value) : value
      });
    return getall ? allValues : allValues.pop()
  }

  async getall(path) {
    return this.get(path, true)
  }

  async getSubsections(section) {
    return this.parsedConfig
      .filter(config => config.section === section && config.isSection)
      .map(config => config.subsection)
  }

  async deleteSection(section, subsection) {
    this.parsedConfig = this.parsedConfig.filter(
      config =>
        !(config.section === section && config.subsection === subsection)
    );
  }

  async append(path, value) {
    return this.set(path, value, true)
  }

  async set(path, value, append = false) {
    const {
      section,
      subsection,
      name,
      path: normalizedPath,
      sectionPath,
    } = normalizePath$1(path);
    const configIndex = findLastIndex(
      this.parsedConfig,
      config => config.path === normalizedPath
    );
    if (value == null) {
      if (configIndex !== -1) {
        this.parsedConfig.splice(configIndex, 1);
      }
    } else {
      if (configIndex !== -1) {
        const config = this.parsedConfig[configIndex];
        // Name should be overwritten in case the casing changed
        const modifiedConfig = Object.assign({}, config, {
          name,
          value,
          modified: true,
        });
        if (append) {
          this.parsedConfig.splice(configIndex + 1, 0, modifiedConfig);
        } else {
          this.parsedConfig[configIndex] = modifiedConfig;
        }
      } else {
        const sectionIndex = this.parsedConfig.findIndex(
          config => config.path === sectionPath
        );
        const newConfig = {
          section,
          subsection,
          name,
          value,
          modified: true,
          path: normalizedPath,
        };
        if (SECTION_REGEX.test(section) && VARIABLE_NAME_REGEX.test(name)) {
          if (sectionIndex >= 0) {
            // Reuse existing section
            this.parsedConfig.splice(sectionIndex + 1, 0, newConfig);
          } else {
            // Add a new section
            const newSection = {
              section,
              subsection,
              modified: true,
              path: sectionPath,
            };
            this.parsedConfig.push(newSection, newConfig);
          }
        }
      }
    }
  }

  toString() {
    return this.parsedConfig
      .map(({ line, section, subsection, name, value, modified = false }) => {
        if (!modified) {
          return line
        }
        if (name != null && value != null) {
          if (typeof value === 'string' && /[#;]/.test(value)) {
            // A `#` or `;` symbol denotes a comment, so we have to wrap it in double quotes
            return `\t${name} = "${value}"`
          }
          return `\t${name} = ${value}`
        }
        if (subsection != null) {
          return `[${section} "${subsection}"]`
        }
        return `[${section}]`
      })
      .join('\n')
  }
}

class GitConfigManager {
  static async get({ fs, gitdir }) {
    // We can improve efficiency later if needed.
    // TODO: read from full list of git config files
    const text = await fs.read(`${gitdir}/config`, { encoding: 'utf8' });
    return GitConfig.from(text)
  }

  static async save({ fs, gitdir, config }) {
    // We can improve efficiency later if needed.
    // TODO: handle saving to the correct global/user/repo location
    await fs.write(`${gitdir}/config`, config.toString(), {
      encoding: 'utf8',
    });
  }
}

// This is a convenience wrapper for reading and writing files in the 'refs' directory.

// @see https://git-scm.com/docs/git-rev-parse.html#_specifying_revisions
const refpaths = ref => [
  `${ref}`,
  `refs/${ref}`,
  `refs/tags/${ref}`,
  `refs/heads/${ref}`,
  `refs/remotes/${ref}`,
  `refs/remotes/${ref}/HEAD`,
];

// @see https://git-scm.com/docs/gitrepository-layout
const GIT_FILES = ['config', 'description', 'index', 'shallow', 'commondir'];

class GitRefManager {
  static async updateRemoteRefs({
    fs,
    gitdir,
    remote,
    refs,
    symrefs,
    tags,
    refspecs = undefined,
    prune = false,
    pruneTags = false,
  }) {
    // Validate input
    for (const value of refs.values()) {
      if (!value.match(/[0-9a-f]{40}/)) {
        throw new InvalidOidError(value)
      }
    }
    const config = await GitConfigManager.get({ fs, gitdir });
    if (!refspecs) {
      refspecs = await config.getall(`remote.${remote}.fetch`);
      if (refspecs.length === 0) {
        throw new NoRefspecError(remote)
      }
      // There's some interesting behavior with HEAD that doesn't follow the refspec.
      refspecs.unshift(`+HEAD:refs/remotes/${remote}/HEAD`);
    }
    const refspec = GitRefSpecSet.from(refspecs);
    const actualRefsToWrite = new Map();
    // Delete all current tags if the pruneTags argument is true.
    if (pruneTags) {
      const tags = await GitRefManager.listRefs({
        fs,
        gitdir,
        filepath: 'refs/tags',
      });
      await GitRefManager.deleteRefs({
        fs,
        gitdir,
        refs: tags.map(tag => `refs/tags/${tag}`),
      });
    }
    // Add all tags if the fetch tags argument is true.
    if (tags) {
      for (const serverRef of refs.keys()) {
        if (serverRef.startsWith('refs/tags') && !serverRef.endsWith('^{}')) {
          // Git's behavior is to only fetch tags that do not conflict with tags already present.
          if (!(await GitRefManager.exists({ fs, gitdir, ref: serverRef }))) {
            // Always use the object id of the tag itself, and not the peeled object id.
            const oid = refs.get(serverRef);
            actualRefsToWrite.set(serverRef, oid);
          }
        }
      }
    }
    // Combine refs and symrefs giving symrefs priority
    const refTranslations = refspec.translate([...refs.keys()]);
    for (const [serverRef, translatedRef] of refTranslations) {
      const value = refs.get(serverRef);
      actualRefsToWrite.set(translatedRef, value);
    }
    const symrefTranslations = refspec.translate([...symrefs.keys()]);
    for (const [serverRef, translatedRef] of symrefTranslations) {
      const value = symrefs.get(serverRef);
      const symtarget = refspec.translateOne(value);
      if (symtarget) {
        actualRefsToWrite.set(translatedRef, `ref: ${symtarget}`);
      }
    }
    // If `prune` argument is true, clear out the existing local refspec roots
    const pruned = [];
    if (prune) {
      for (const filepath of refspec.localNamespaces()) {
        const refs = (
          await GitRefManager.listRefs({
            fs,
            gitdir,
            filepath,
          })
        ).map(file => `${filepath}/${file}`);
        for (const ref of refs) {
          if (!actualRefsToWrite.has(ref)) {
            pruned.push(ref);
          }
        }
      }
      if (pruned.length > 0) {
        await GitRefManager.deleteRefs({ fs, gitdir, refs: pruned });
      }
    }
    // Update files
    // TODO: For large repos with a history of thousands of pull requests
    // (i.e. gitlab-ce) it would be vastly more efficient to write them
    // to .git/packed-refs.
    // The trick is to make sure we a) don't write a packed ref that is
    // already shadowed by a loose ref and b) don't loose any refs already
    // in packed-refs. Doing this efficiently may be difficult. A
    // solution that might work is
    // a) load the current packed-refs file
    // b) add actualRefsToWrite, overriding the existing values if present
    // c) enumerate all the loose refs currently in .git/refs/remotes/${remote}
    // d) overwrite their value with the new value.
    // Examples of refs we need to avoid writing in loose format for efficieny's sake
    // are .git/refs/remotes/origin/refs/remotes/remote_mirror_3059
    // and .git/refs/remotes/origin/refs/merge-requests
    for (const [key, value] of actualRefsToWrite) {
      await fs.write(join(gitdir, key), `${value.trim()}\n`, 'utf8');
    }
    return { pruned }
  }

  // TODO: make this less crude?
  static async writeRef({ fs, gitdir, ref, value }) {
    // Validate input
    if (!value.match(/[0-9a-f]{40}/)) {
      throw new InvalidOidError(value)
    }
    await fs.write(join(gitdir, ref), `${value.trim()}\n`, 'utf8');
  }

  static async writeSymbolicRef({ fs, gitdir, ref, value }) {
    await fs.write(join(gitdir, ref), 'ref: ' + `${value.trim()}\n`, 'utf8');
  }

  static async deleteRef({ fs, gitdir, ref }) {
    return GitRefManager.deleteRefs({ fs, gitdir, refs: [ref] })
  }

  static async deleteRefs({ fs, gitdir, refs }) {
    // Delete regular ref
    await Promise.all(refs.map(ref => fs.rm(join(gitdir, ref))));
    // Delete any packed ref
    let text = await fs.read(`${gitdir}/packed-refs`, { encoding: 'utf8' });
    const packed = GitPackedRefs.from(text);
    const beforeSize = packed.refs.size;
    for (const ref of refs) {
      if (packed.refs.has(ref)) {
        packed.delete(ref);
      }
    }
    if (packed.refs.size < beforeSize) {
      text = packed.toString();
      await fs.write(`${gitdir}/packed-refs`, text, { encoding: 'utf8' });
    }
  }

  /**
   * @param {object} args
   * @param {import('../models/FileSystem.js').FileSystem} args.fs
   * @param {string} args.gitdir
   * @param {string} args.ref
   * @param {number} [args.depth]
   * @returns {Promise<string>}
   */
  static async resolve({ fs, gitdir, ref, depth = undefined }) {
    if (depth !== undefined) {
      depth--;
      if (depth === -1) {
        return ref
      }
    }
    let sha;
    // Is it a ref pointer?
    if (ref.startsWith('ref: ')) {
      ref = ref.slice('ref: '.length);
      return GitRefManager.resolve({ fs, gitdir, ref, depth })
    }
    // Is it a complete and valid SHA?
    if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
      return ref
    }
    // We need to alternate between the file system and the packed-refs
    const packedMap = await GitRefManager.packedRefs({ fs, gitdir });
    // Look in all the proper paths, in this order
    const allpaths = refpaths(ref).filter(p => !GIT_FILES.includes(p)); // exclude git system files (#709)

    for (const ref of allpaths) {
      sha =
        (await fs.read(`${gitdir}/${ref}`, { encoding: 'utf8' })) ||
        packedMap.get(ref);
      if (sha) {
        return GitRefManager.resolve({ fs, gitdir, ref: sha.trim(), depth })
      }
    }
    // Do we give up?
    throw new NotFoundError(ref)
  }

  static async exists({ fs, gitdir, ref }) {
    try {
      await GitRefManager.expand({ fs, gitdir, ref });
      return true
    } catch (err) {
      return false
    }
  }

  static async expand({ fs, gitdir, ref }) {
    // Is it a complete and valid SHA?
    if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
      return ref
    }
    // We need to alternate between the file system and the packed-refs
    const packedMap = await GitRefManager.packedRefs({ fs, gitdir });
    // Look in all the proper paths, in this order
    const allpaths = refpaths(ref);
    for (const ref of allpaths) {
      if (await fs.exists(`${gitdir}/${ref}`)) return ref
      if (packedMap.has(ref)) return ref
    }
    // Do we give up?
    throw new NotFoundError(ref)
  }

  static async expandAgainstMap({ ref, map }) {
    // Look in all the proper paths, in this order
    const allpaths = refpaths(ref);
    for (const ref of allpaths) {
      if (await map.has(ref)) return ref
    }
    // Do we give up?
    throw new NotFoundError(ref)
  }

  static resolveAgainstMap({ ref, fullref = ref, depth = undefined, map }) {
    if (depth !== undefined) {
      depth--;
      if (depth === -1) {
        return { fullref, oid: ref }
      }
    }
    // Is it a ref pointer?
    if (ref.startsWith('ref: ')) {
      ref = ref.slice('ref: '.length);
      return GitRefManager.resolveAgainstMap({ ref, fullref, depth, map })
    }
    // Is it a complete and valid SHA?
    if (ref.length === 40 && /[0-9a-f]{40}/.test(ref)) {
      return { fullref, oid: ref }
    }
    // Look in all the proper paths, in this order
    const allpaths = refpaths(ref);
    for (const ref of allpaths) {
      const sha = map.get(ref);
      if (sha) {
        return GitRefManager.resolveAgainstMap({
          ref: sha.trim(),
          fullref: ref,
          depth,
          map,
        })
      }
    }
    // Do we give up?
    throw new NotFoundError(ref)
  }

  static async packedRefs({ fs, gitdir }) {
    const text = await fs.read(`${gitdir}/packed-refs`, { encoding: 'utf8' });
    const packed = GitPackedRefs.from(text);
    return packed.refs
  }

  // List all the refs that match the `filepath` prefix
  static async listRefs({ fs, gitdir, filepath }) {
    const packedMap = GitRefManager.packedRefs({ fs, gitdir });
    let files = null;
    try {
      files = await fs.readdirDeep(`${gitdir}/${filepath}`);
      files = files.map(x => x.replace(`${gitdir}/${filepath}/`, ''));
    } catch (err) {
      files = [];
    }

    for (let key of (await packedMap).keys()) {
      // filter by prefix
      if (key.startsWith(filepath)) {
        // remove prefix
        key = key.replace(filepath + '/', '');
        // Don't include duplicates; the loose files have precedence anyway
        if (!files.includes(key)) {
          files.push(key);
        }
      }
    }
    // since we just appended things onto an array, we need to sort them now
    files.sort(compareRefNames);
    return files
  }

  static async listBranches({ fs, gitdir, remote }) {
    if (remote) {
      return GitRefManager.listRefs({
        fs,
        gitdir,
        filepath: `refs/remotes/${remote}`,
      })
    } else {
      return GitRefManager.listRefs({ fs, gitdir, filepath: `refs/heads` })
    }
  }

  static async listTags({ fs, gitdir }) {
    const tags = await GitRefManager.listRefs({
      fs,
      gitdir,
      filepath: `refs/tags`,
    });
    return tags.filter(x => !x.endsWith('^{}'))
  }
}

function compareTreeEntryPath(a, b) {
  // Git sorts tree entries as if there is a trailing slash on directory names.
  return compareStrings(appendSlashIfDir(a), appendSlashIfDir(b))
}

function appendSlashIfDir(entry) {
  return entry.mode === '040000' ? entry.path + '/' : entry.path
}

/**
 *
 * @typedef {Object} TreeEntry
 * @property {string} mode - the 6 digit hexadecimal mode
 * @property {string} path - the name of the file or directory
 * @property {string} oid - the SHA-1 object id of the blob or tree
 * @property {'commit'|'blob'|'tree'} type - the type of object
 */

function mode2type$1(mode) {
  // prettier-ignore
  switch (mode) {
    case '040000': return 'tree'
    case '100644': return 'blob'
    case '100755': return 'blob'
    case '120000': return 'blob'
    case '160000': return 'commit'
  }
  throw new InternalError(`Unexpected GitTree entry mode: ${mode}`)
}

function parseBuffer(buffer) {
  const _entries = [];
  let cursor = 0;
  while (cursor < buffer.length) {
    const space = buffer.indexOf(32, cursor);
    if (space === -1) {
      throw new InternalError(
        `GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next space character.`
      )
    }
    const nullchar = buffer.indexOf(0, cursor);
    if (nullchar === -1) {
      throw new InternalError(
        `GitTree: Error parsing buffer at byte location ${cursor}: Could not find the next null character.`
      )
    }
    let mode = buffer.slice(cursor, space).toString('utf8');
    if (mode === '40000') mode = '040000'; // makes it line up neater in printed output
    const type = mode2type$1(mode);
    const path = buffer.slice(space + 1, nullchar).toString('utf8');

    // Prevent malicious git repos from writing to "..\foo" on clone etc
    if (path.includes('\\') || path.includes('/')) {
      throw new UnsafeFilepathError(path)
    }

    const oid = buffer.slice(nullchar + 1, nullchar + 21).toString('hex');
    cursor = nullchar + 21;
    _entries.push({ mode, path, oid, type });
  }
  return _entries
}

function limitModeToAllowed(mode) {
  if (typeof mode === 'number') {
    mode = mode.toString(8);
  }
  // tree
  if (mode.match(/^0?4.*/)) return '040000' // Directory
  if (mode.match(/^1006.*/)) return '100644' // Regular non-executable file
  if (mode.match(/^1007.*/)) return '100755' // Regular executable file
  if (mode.match(/^120.*/)) return '120000' // Symbolic link
  if (mode.match(/^160.*/)) return '160000' // Commit (git submodule reference)
  throw new InternalError(`Could not understand file mode: ${mode}`)
}

function nudgeIntoShape(entry) {
  if (!entry.oid && entry.sha) {
    entry.oid = entry.sha; // Github
  }
  entry.mode = limitModeToAllowed(entry.mode); // index
  if (!entry.type) {
    entry.type = mode2type$1(entry.mode); // index
  }
  return entry
}

class GitTree {
  constructor(entries) {
    if (Buffer.isBuffer(entries)) {
      this._entries = parseBuffer(entries);
    } else if (Array.isArray(entries)) {
      this._entries = entries.map(nudgeIntoShape);
    } else {
      throw new InternalError('invalid type passed to GitTree constructor')
    }
    // Tree entries are not sorted alphabetically in the usual sense (see `compareTreeEntryPath`)
    // but it is important later on that these be sorted in the same order as they would be returned from readdir.
    this._entries.sort(comparePath);
  }

  static from(tree) {
    return new GitTree(tree)
  }

  render() {
    return this._entries
      .map(entry => `${entry.mode} ${entry.type} ${entry.oid}    ${entry.path}`)
      .join('\n')
  }

  toObject() {
    // Adjust the sort order to match git's
    const entries = [...this._entries];
    entries.sort(compareTreeEntryPath);
    return Buffer.concat(
      entries.map(entry => {
        const mode = Buffer.from(entry.mode.replace(/^0/, ''));
        const space = Buffer.from(' ');
        const path = Buffer.from(entry.path, 'utf8');
        const nullchar = Buffer.from([0]);
        const oid = Buffer.from(entry.oid, 'hex');
        return Buffer.concat([mode, space, path, nullchar, oid])
      })
    )
  }

  /**
   * @returns {TreeEntry[]}
   */
  entries() {
    return this._entries
  }

  *[Symbol.iterator]() {
    for (const entry of this._entries) {
      yield entry;
    }
  }
}

class GitObject {
  static wrap({ type, object }) {
    return Buffer.concat([
      Buffer.from(`${type} ${object.byteLength.toString()}\x00`),
      Buffer.from(object),
    ])
  }

  static unwrap(buffer) {
    const s = buffer.indexOf(32); // first space
    const i = buffer.indexOf(0); // first null value
    const type = buffer.slice(0, s).toString('utf8'); // get type of object
    const length = buffer.slice(s + 1, i).toString('utf8'); // get type of object
    const actualLength = buffer.length - (i + 1);
    // verify length
    if (parseInt(length) !== actualLength) {
      throw new InternalError(
        `Length mismatch: expected ${length} bytes but got ${actualLength} instead.`
      )
    }
    return {
      type,
      object: Buffer.from(buffer.slice(i + 1)),
    }
  }
}

async function readObjectLoose({ fs, gitdir, oid }) {
  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
  const file = await fs.read(`${gitdir}/${source}`);
  if (!file) {
    return null
  }
  return { object: file, format: 'deflated', source }
}

/**
 * @param {Buffer} delta
 * @param {Buffer} source
 * @returns {Buffer}
 */
function applyDelta(delta, source) {
  const reader = new BufferCursor(delta);
  const sourceSize = readVarIntLE(reader);

  if (sourceSize !== source.byteLength) {
    throw new InternalError(
      `applyDelta expected source buffer to be ${sourceSize} bytes but the provided buffer was ${source.length} bytes`
    )
  }
  const targetSize = readVarIntLE(reader);
  let target;

  const firstOp = readOp(reader, source);
  // Speed optimization - return raw buffer if it's just single simple copy
  if (firstOp.byteLength === targetSize) {
    target = firstOp;
  } else {
    // Otherwise, allocate a fresh buffer and slices
    target = Buffer.alloc(targetSize);
    const writer = new BufferCursor(target);
    writer.copy(firstOp);

    while (!reader.eof()) {
      writer.copy(readOp(reader, source));
    }

    const tell = writer.tell();
    if (targetSize !== tell) {
      throw new InternalError(
        `applyDelta expected target buffer to be ${targetSize} bytes but the resulting buffer was ${tell} bytes`
      )
    }
  }
  return target
}

function readVarIntLE(reader) {
  let result = 0;
  let shift = 0;
  let byte = null;
  do {
    byte = reader.readUInt8();
    result |= (byte & 0b01111111) << shift;
    shift += 7;
  } while (byte & 0b10000000)
  return result
}

function readCompactLE(reader, flags, size) {
  let result = 0;
  let shift = 0;
  while (size--) {
    if (flags & 0b00000001) {
      result |= reader.readUInt8() << shift;
    }
    flags >>= 1;
    shift += 8;
  }
  return result
}

function readOp(reader, source) {
  /** @type {number} */
  const byte = reader.readUInt8();
  const COPY = 0b10000000;
  const OFFS = 0b00001111;
  const SIZE = 0b01110000;
  if (byte & COPY) {
    // copy consists of 4 byte offset, 3 byte size (in LE order)
    const offset = readCompactLE(reader, byte & OFFS, 4);
    let size = readCompactLE(reader, (byte & SIZE) >> 4, 3);
    // Yup. They really did this optimization.
    if (size === 0) size = 0x10000;
    return source.slice(offset, offset + size)
  } else {
    // insert
    return reader.slice(byte)
  }
}

// Convert a value to an Async Iterator
// This will be easier with async generator functions.
function fromValue(value) {
  let queue = [value];
  return {
    next() {
      return Promise.resolve({ done: queue.length === 0, value: queue.pop() })
    },
    return() {
      queue = [];
      return {}
    },
    [Symbol.asyncIterator]() {
      return this
    },
  }
}

function getIterator(iterable) {
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]()
  }
  if (iterable[Symbol.iterator]) {
    return iterable[Symbol.iterator]()
  }
  if (iterable.next) {
    return iterable
  }
  return fromValue(iterable)
}

// inspired by 'gartal' but lighter-weight and more battle-tested.
class StreamReader {
  constructor(stream) {
    this.stream = getIterator(stream);
    this.buffer = null;
    this.cursor = 0;
    this.undoCursor = 0;
    this.started = false;
    this._ended = false;
    this._discardedBytes = 0;
  }

  eof() {
    return this._ended && this.cursor === this.buffer.length
  }

  tell() {
    return this._discardedBytes + this.cursor
  }

  async byte() {
    if (this.eof()) return
    if (!this.started) await this._init();
    if (this.cursor === this.buffer.length) {
      await this._loadnext();
      if (this._ended) return
    }
    this._moveCursor(1);
    return this.buffer[this.undoCursor]
  }

  async chunk() {
    if (this.eof()) return
    if (!this.started) await this._init();
    if (this.cursor === this.buffer.length) {
      await this._loadnext();
      if (this._ended) return
    }
    this._moveCursor(this.buffer.length);
    return this.buffer.slice(this.undoCursor, this.cursor)
  }

  async read(n) {
    if (this.eof()) return
    if (!this.started) await this._init();
    if (this.cursor + n > this.buffer.length) {
      this._trim();
      await this._accumulate(n);
    }
    this._moveCursor(n);
    return this.buffer.slice(this.undoCursor, this.cursor)
  }

  async skip(n) {
    if (this.eof()) return
    if (!this.started) await this._init();
    if (this.cursor + n > this.buffer.length) {
      this._trim();
      await this._accumulate(n);
    }
    this._moveCursor(n);
  }

  async undo() {
    this.cursor = this.undoCursor;
  }

  async _next() {
    this.started = true;
    let { done, value } = await this.stream.next();
    if (done) {
      this._ended = true;
    }
    if (value) {
      value = Buffer.from(value);
    }
    return value
  }

  _trim() {
    // Throw away parts of the buffer we don't need anymore
    // assert(this.cursor <= this.buffer.length)
    this.buffer = this.buffer.slice(this.undoCursor);
    this.cursor -= this.undoCursor;
    this._discardedBytes += this.undoCursor;
    this.undoCursor = 0;
  }

  _moveCursor(n) {
    this.undoCursor = this.cursor;
    this.cursor += n;
    if (this.cursor > this.buffer.length) {
      this.cursor = this.buffer.length;
    }
  }

  async _accumulate(n) {
    if (this._ended) return
    // Expand the buffer until we have N bytes of data
    // or we've reached the end of the stream
    const buffers = [this.buffer];
    while (this.cursor + n > lengthBuffers(buffers)) {
      const nextbuffer = await this._next();
      if (this._ended) break
      buffers.push(nextbuffer);
    }
    this.buffer = Buffer.concat(buffers);
  }

  async _loadnext() {
    this._discardedBytes += this.buffer.length;
    this.undoCursor = 0;
    this.cursor = 0;
    this.buffer = await this._next();
  }

  async _init() {
    this.buffer = await this._next();
  }
}

// This helper function helps us postpone concatenating buffers, which
// would create intermediate buffer objects,
function lengthBuffers(buffers) {
  return buffers.reduce((acc, buffer) => acc + buffer.length, 0)
}

// My version of git-list-pack - roughly 15x faster than the original

async function listpack(stream, onData) {
  const reader = new StreamReader(stream);
  let PACK = await reader.read(4);
  PACK = PACK.toString('utf8');
  if (PACK !== 'PACK') {
    throw new InternalError(`Invalid PACK header '${PACK}'`)
  }

  let version = await reader.read(4);
  version = version.readUInt32BE(0);
  if (version !== 2) {
    throw new InternalError(`Invalid packfile version: ${version}`)
  }

  let numObjects = await reader.read(4);
  numObjects = numObjects.readUInt32BE(0);
  // If (for some godforsaken reason) this is an empty packfile, abort now.
  if (numObjects < 1) return

  while (!reader.eof() && numObjects--) {
    const offset = reader.tell();
    const { type, length, ofs, reference } = await parseHeader(reader);
    const inflator = new pako.Inflate();
    while (!inflator.result) {
      const chunk = await reader.chunk();
      if (!chunk) break
      inflator.push(chunk, false);
      if (inflator.err) {
        throw new InternalError(`Pako error: ${inflator.msg}`)
      }
      if (inflator.result) {
        if (inflator.result.length !== length) {
          throw new InternalError(
            `Inflated object size is different from that stated in packfile.`
          )
        }

        // Backtrack parser to where deflated data ends
        await reader.undo();
        await reader.read(chunk.length - inflator.strm.avail_in);
        const end = reader.tell();
        await onData({
          data: inflator.result,
          type,
          num: numObjects,
          offset,
          end,
          reference,
          ofs,
        });
      }
    }
  }
}

async function parseHeader(reader) {
  // Object type is encoded in bits 654
  let byte = await reader.byte();
  const type = (byte >> 4) & 0b111;
  // The length encoding get complicated.
  // Last four bits of length is encoded in bits 3210
  let length = byte & 0b1111;
  // Whether the next byte is part of the variable-length encoded number
  // is encoded in bit 7
  if (byte & 0b10000000) {
    let shift = 4;
    do {
      byte = await reader.byte();
      length |= (byte & 0b01111111) << shift;
      shift += 7;
    } while (byte & 0b10000000)
  }
  // Handle deltified objects
  let ofs;
  let reference;
  if (type === 6) {
    let shift = 0;
    ofs = 0;
    const bytes = [];
    do {
      byte = await reader.byte();
      ofs |= (byte & 0b01111111) << shift;
      shift += 7;
      bytes.push(byte);
    } while (byte & 0b10000000)
    reference = Buffer.from(bytes);
  }
  if (type === 7) {
    const buf = await reader.read(20);
    reference = buf;
  }
  return { type, length, ofs, reference }
}

/* eslint-env node, browser */

let supportsDecompressionStream = false;

async function inflate(buffer) {
  if (supportsDecompressionStream === null) {
    supportsDecompressionStream = testDecompressionStream();
  }
  return supportsDecompressionStream
    ? browserInflate(buffer)
    : pako.inflate(buffer)
}

async function browserInflate(buffer) {
  const ds = new DecompressionStream('deflate');
  const d = new Blob([buffer]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(d).arrayBuffer())
}

function testDecompressionStream() {
  try {
    const ds = new DecompressionStream('deflate');
    if (ds) return true
  } catch (_) {
    // no bother
  }
  return false
}

function decodeVarInt(reader) {
  const bytes = [];
  let byte = 0;
  let multibyte = 0;
  do {
    byte = reader.readUInt8();
    // We keep bits 6543210
    const lastSeven = byte & 0b01111111;
    bytes.push(lastSeven);
    // Whether the next byte is part of the variable-length encoded number
    // is encoded in bit 7
    multibyte = byte & 0b10000000;
  } while (multibyte)
  // Now that all the bytes are in big-endian order,
  // alternate shifting the bits left by 7 and OR-ing the next byte.
  // And... do a weird increment-by-one thing that I don't quite understand.
  return bytes.reduce((a, b) => ((a + 1) << 7) | b, -1)
}

// I'm pretty much copying this one from the git C source code,
// because it makes no sense.
function otherVarIntDecode(reader, startWith) {
  let result = startWith;
  let shift = 4;
  let byte = null;
  do {
    byte = reader.readUInt8();
    result |= (byte & 0b01111111) << shift;
    shift += 7;
  } while (byte & 0b10000000)
  return result
}

class GitPackIndex {
  constructor(stuff) {
    Object.assign(this, stuff);
    this.offsetCache = {};
  }

  static async fromIdx({ idx, getExternalRefDelta }) {
    const reader = new BufferCursor(idx);
    const magic = reader.slice(4).toString('hex');
    // Check for IDX v2 magic number
    if (magic !== 'ff744f63') {
      return // undefined
    }
    const version = reader.readUInt32BE();
    if (version !== 2) {
      throw new InternalError(
        `Unable to read version ${version} packfile IDX. (Only version 2 supported)`
      )
    }
    if (idx.byteLength > 2048 * 1024 * 1024) {
      throw new InternalError(
        `To keep implementation simple, I haven't implemented the layer 5 feature needed to support packfiles > 2GB in size.`
      )
    }
    // Skip over fanout table
    reader.seek(reader.tell() + 4 * 255);
    // Get hashes
    const size = reader.readUInt32BE();
    const hashes = [];
    for (let i = 0; i < size; i++) {
      const hash = reader.slice(20).toString('hex');
      hashes[i] = hash;
    }
    reader.seek(reader.tell() + 4 * size);
    // Skip over CRCs
    // Get offsets
    const offsets = new Map();
    for (let i = 0; i < size; i++) {
      offsets.set(hashes[i], reader.readUInt32BE());
    }
    const packfileSha = reader.slice(20).toString('hex');
    return new GitPackIndex({
      hashes,
      crcs: {},
      offsets,
      packfileSha,
      getExternalRefDelta,
    })
  }

  static async fromPack({ pack, getExternalRefDelta, onProgress }) {
    const listpackTypes = {
      1: 'commit',
      2: 'tree',
      3: 'blob',
      4: 'tag',
      6: 'ofs-delta',
      7: 'ref-delta',
    };
    const offsetToObject = {};

    // Older packfiles do NOT use the shasum of the pack itself,
    // so it is recommended to just use whatever bytes are in the trailer.
    // Source: https://github.com/git/git/commit/1190a1acf800acdcfd7569f87ac1560e2d077414
    const packfileSha = pack.slice(-20).toString('hex');

    const hashes = [];
    const crcs = {};
    const offsets = new Map();
    let totalObjectCount = null;
    let lastPercent = null;

    await listpack([pack], async ({ data, type, reference, offset, num }) => {
      if (totalObjectCount === null) totalObjectCount = num;
      const percent = Math.floor(
        ((totalObjectCount - num) * 100) / totalObjectCount
      );
      if (percent !== lastPercent) {
        if (onProgress) {
          await onProgress({
            phase: 'Receiving objects',
            loaded: totalObjectCount - num,
            total: totalObjectCount,
          });
        }
      }
      lastPercent = percent;
      // Change type from a number to a meaningful string
      type = listpackTypes[type];

      if (['commit', 'tree', 'blob', 'tag'].includes(type)) {
        offsetToObject[offset] = {
          type,
          offset,
        };
      } else if (type === 'ofs-delta') {
        offsetToObject[offset] = {
          type,
          offset,
        };
      } else if (type === 'ref-delta') {
        offsetToObject[offset] = {
          type,
          offset,
        };
      }
    });

    // We need to know the lengths of the slices to compute the CRCs.
    const offsetArray = Object.keys(offsetToObject).map(Number);
    for (const [i, start] of offsetArray.entries()) {
      const end =
        i + 1 === offsetArray.length ? pack.byteLength - 20 : offsetArray[i + 1];
      const o = offsetToObject[start];
      const crc = crc32.buf(pack.slice(start, end)) >>> 0;
      o.end = end;
      o.crc = crc;
    }

    // We don't have the hashes yet. But we can generate them using the .readSlice function!
    const p = new GitPackIndex({
      pack: Promise.resolve(pack),
      packfileSha,
      crcs,
      hashes,
      offsets,
      getExternalRefDelta,
    });

    // Resolve deltas and compute the oids
    lastPercent = null;
    let count = 0;
    const objectsByDepth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let offset in offsetToObject) {
      offset = Number(offset);
      const percent = Math.floor((count * 100) / totalObjectCount);
      if (percent !== lastPercent) {
        if (onProgress) {
          await onProgress({
            phase: 'Resolving deltas',
            loaded: count,
            total: totalObjectCount,
          });
        }
      }
      count++;
      lastPercent = percent;

      const o = offsetToObject[offset];
      if (o.oid) continue
      try {
        p.readDepth = 0;
        p.externalReadDepth = 0;
        const { type, object } = await p.readSlice({ start: offset });
        objectsByDepth[p.readDepth] += 1;
        const oid = await shasum(GitObject.wrap({ type, object }));
        o.oid = oid;
        hashes.push(oid);
        offsets.set(oid, offset);
        crcs[oid] = o.crc;
      } catch (err) {
        continue
      }
    }

    hashes.sort();
    return p
  }

  async toBuffer() {
    const buffers = [];
    const write = (str, encoding) => {
      buffers.push(Buffer.from(str, encoding));
    };
    // Write out IDX v2 magic number
    write('ff744f63', 'hex');
    // Write out version number 2
    write('00000002', 'hex');
    // Write fanout table
    const fanoutBuffer = new BufferCursor(Buffer.alloc(256 * 4));
    for (let i = 0; i < 256; i++) {
      let count = 0;
      for (const hash of this.hashes) {
        if (parseInt(hash.slice(0, 2), 16) <= i) count++;
      }
      fanoutBuffer.writeUInt32BE(count);
    }
    buffers.push(fanoutBuffer.buffer);
    // Write out hashes
    for (const hash of this.hashes) {
      write(hash, 'hex');
    }
    // Write out crcs
    const crcsBuffer = new BufferCursor(Buffer.alloc(this.hashes.length * 4));
    for (const hash of this.hashes) {
      crcsBuffer.writeUInt32BE(this.crcs[hash]);
    }
    buffers.push(crcsBuffer.buffer);
    // Write out offsets
    const offsetsBuffer = new BufferCursor(Buffer.alloc(this.hashes.length * 4));
    for (const hash of this.hashes) {
      offsetsBuffer.writeUInt32BE(this.offsets.get(hash));
    }
    buffers.push(offsetsBuffer.buffer);
    // Write out packfile checksum
    write(this.packfileSha, 'hex');
    // Write out shasum
    const totalBuffer = Buffer.concat(buffers);
    const sha = await shasum(totalBuffer);
    const shaBuffer = Buffer.alloc(20);
    shaBuffer.write(sha, 'hex');
    return Buffer.concat([totalBuffer, shaBuffer])
  }

  async load({ pack }) {
    this.pack = pack;
  }

  async unload() {
    this.pack = null;
  }

  async read({ oid }) {
    if (!this.offsets.get(oid)) {
      if (this.getExternalRefDelta) {
        this.externalReadDepth++;
        return this.getExternalRefDelta(oid)
      } else {
        throw new InternalError(`Could not read object ${oid} from packfile`)
      }
    }
    const start = this.offsets.get(oid);
    return this.readSlice({ start })
  }

  async readSlice({ start }) {
    if (this.offsetCache[start]) {
      return Object.assign({}, this.offsetCache[start])
    }
    this.readDepth++;
    const types = {
      0b0010000: 'commit',
      0b0100000: 'tree',
      0b0110000: 'blob',
      0b1000000: 'tag',
      0b1100000: 'ofs_delta',
      0b1110000: 'ref_delta',
    };
    if (!this.pack) {
      throw new InternalError(
        'Tried to read from a GitPackIndex with no packfile loaded into memory'
      )
    }
    const raw = (await this.pack).slice(start);
    const reader = new BufferCursor(raw);
    const byte = reader.readUInt8();
    // Object type is encoded in bits 654
    const btype = byte & 0b1110000;
    let type = types[btype];
    if (type === undefined) {
      throw new InternalError('Unrecognized type: 0b' + btype.toString(2))
    }
    // The length encoding get complicated.
    // Last four bits of length is encoded in bits 3210
    const lastFour = byte & 0b1111;
    let length = lastFour;
    // Whether the next byte is part of the variable-length encoded number
    // is encoded in bit 7
    const multibyte = byte & 0b10000000;
    if (multibyte) {
      length = otherVarIntDecode(reader, lastFour);
    }
    let base = null;
    let object = null;
    // Handle deltified objects
    if (type === 'ofs_delta') {
      const offset = decodeVarInt(reader);
      const baseOffset = start - offset
      ;({ object: base, type } = await this.readSlice({ start: baseOffset }));
    }
    if (type === 'ref_delta') {
      const oid = reader.slice(20).toString('hex')
      ;({ object: base, type } = await this.read({ oid }));
    }
    // Handle undeltified objects
    const buffer = raw.slice(reader.tell());
    object = Buffer.from(await inflate(buffer));
    // Assert that the object length is as expected.
    if (object.byteLength !== length) {
      throw new InternalError(
        `Packfile told us object would have length ${length} but it had length ${object.byteLength}`
      )
    }
    if (base) {
      object = Buffer.from(applyDelta(object, base));
    }
    // Cache the result based on depth.
    if (this.readDepth > 3) {
      // hand tuned for speed / memory usage tradeoff
      this.offsetCache[start] = { type, object };
    }
    return { type, format: 'content', object }
  }
}

const PackfileCache = Symbol('PackfileCache');

async function loadPackIndex({
  fs,
  filename,
  getExternalRefDelta,
  emitter,
  emitterPrefix,
}) {
  const idx = await fs.read(filename);
  return GitPackIndex.fromIdx({ idx, getExternalRefDelta })
}

function readPackIndex({
  fs,
  cache,
  filename,
  getExternalRefDelta,
  emitter,
  emitterPrefix,
}) {
  // Try to get the packfile index from the in-memory cache
  if (!cache[PackfileCache]) cache[PackfileCache] = new Map();
  let p = cache[PackfileCache].get(filename);
  if (!p) {
    p = loadPackIndex({
      fs,
      filename,
      getExternalRefDelta,
      emitter,
      emitterPrefix,
    });
    cache[PackfileCache].set(filename, p);
  }
  return p
}

async function readObjectPacked({
  fs,
  cache,
  gitdir,
  oid,
  format = 'content',
  getExternalRefDelta,
}) {
  // Check to see if it's in a packfile.
  // Iterate through all the .idx files
  let list = await fs.readdir(join(gitdir, 'objects/pack'));
  list = list.filter(x => x.endsWith('.idx'));
  for (const filename of list) {
    const indexFile = `${gitdir}/objects/pack/${filename}`;
    const p = await readPackIndex({
      fs,
      cache,
      filename: indexFile,
      getExternalRefDelta,
    });
    if (p.error) throw new InternalError(p.error)
    // If the packfile DOES have the oid we're looking for...
    if (p.offsets.has(oid)) {
      // Get the resolved git object from the packfile
      if (!p.pack) {
        const packFile = indexFile.replace(/idx$/, 'pack');
        p.pack = fs.read(packFile);
      }
      const result = await p.read({ oid, getExternalRefDelta });
      result.format = 'content';
      result.source = `objects/pack/${filename.replace(/idx$/, 'pack')}`;
      return result
    }
  }
  // Failed to find it
  return null
}

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} args.oid
 * @param {string} [args.format]
 */
async function _readObject({
  fs,
  cache,
  gitdir,
  oid,
  format = 'content',
}) {
  // Curry the current read method so that the packfile un-deltification
  // process can acquire external ref-deltas.
  const getExternalRefDelta = oid => _readObject({ fs, cache, gitdir, oid });

  let result;
  // Empty tree - hard-coded so we can use it as a shorthand.
  // Note: I think the canonical git implementation must do this too because
  // `git cat-file -t 4b825dc642cb6eb9a060e54bf8d69288fbee4904` prints "tree" even in empty repos.
  if (oid === '4b825dc642cb6eb9a060e54bf8d69288fbee4904') {
    result = { format: 'wrapped', object: Buffer.from(`tree 0\x00`) };
  }
  // Look for it in the loose object directory.
  if (!result) {
    result = await readObjectLoose({ fs, gitdir, oid });
  }
  // Check to see if it's in a packfile.
  if (!result) {
    result = await readObjectPacked({
      fs,
      cache,
      gitdir,
      oid,
      getExternalRefDelta,
    });
  }
  // Finally
  if (!result) {
    throw new NotFoundError(oid)
  }

  if (format === 'deflated') {
    return result
  }

  if (result.format === 'deflated') {
    result.object = Buffer.from(await inflate(result.object));
    result.format = 'wrapped';
  }

  if (result.format === 'wrapped') {
    if (format === 'wrapped' && result.format === 'wrapped') {
      return result
    }
    const sha = await shasum(result.object);
    if (sha !== oid) {
      throw new InternalError(
        `SHA check failed! Expected ${oid}, computed ${sha}`
      )
    }
    const { object, type } = GitObject.unwrap(result.object);
    result.type = type;
    result.object = object;
    result.format = 'content';
  }

  if (result.format === 'content') {
    if (format === 'content') return result
    return
  }

  throw new InternalError(`invalid format "${result.format}"`)
}

class AlreadyExistsError extends BaseError {
  /**
   * @param {'note'|'remote'|'tag'|'branch'} noun
   * @param {string} where
   * @param {boolean} canForce
   */
  constructor(noun, where, canForce = true) {
    super(
      `Failed to create ${noun} at ${where} because it already exists.${
        canForce
          ? ` (Hint: use 'force: true' parameter to overwrite existing ${noun}.)`
          : ''
      }`
    );
    this.code = this.name = AlreadyExistsError.code;
    this.data = { noun, where, canForce };
  }
}
/** @type {'AlreadyExistsError'} */
AlreadyExistsError.code = 'AlreadyExistsError';

class AmbiguousError extends BaseError {
  /**
   * @param {'oids'|'refs'} nouns
   * @param {string} short
   * @param {string[]} matches
   */
  constructor(nouns, short, matches) {
    super(
      `Found multiple ${nouns} matching "${short}" (${matches.join(
        ', '
      )}). Use a longer abbreviation length to disambiguate them.`
    );
    this.code = this.name = AmbiguousError.code;
    this.data = { nouns, short, matches };
  }
}
/** @type {'AmbiguousError'} */
AmbiguousError.code = 'AmbiguousError';

class CheckoutConflictError extends BaseError {
  /**
   * @param {string[]} filepaths
   */
  constructor(filepaths) {
    super(
      `Your local changes to the following files would be overwritten by checkout: ${filepaths.join(
        ', '
      )}`
    );
    this.code = this.name = CheckoutConflictError.code;
    this.data = { filepaths };
  }
}
/** @type {'CheckoutConflictError'} */
CheckoutConflictError.code = 'CheckoutConflictError';

class CommitNotFetchedError extends BaseError {
  /**
   * @param {string} ref
   * @param {string} oid
   */
  constructor(ref, oid) {
    super(
      `Failed to checkout "${ref}" because commit ${oid} is not available locally. Do a git fetch to make the branch available locally.`
    );
    this.code = this.name = CommitNotFetchedError.code;
    this.data = { ref, oid };
  }
}
/** @type {'CommitNotFetchedError'} */
CommitNotFetchedError.code = 'CommitNotFetchedError';

class EmptyServerResponseError extends BaseError {
  constructor() {
    super(`Empty response from git server.`);
    this.code = this.name = EmptyServerResponseError.code;
    this.data = {};
  }
}
/** @type {'EmptyServerResponseError'} */
EmptyServerResponseError.code = 'EmptyServerResponseError';

class FastForwardError extends BaseError {
  constructor() {
    super(`A simple fast-forward merge was not possible.`);
    this.code = this.name = FastForwardError.code;
    this.data = {};
  }
}
/** @type {'FastForwardError'} */
FastForwardError.code = 'FastForwardError';

class GitPushError extends BaseError {
  /**
   * @param {string} prettyDetails
   * @param {PushResult} result
   */
  constructor(prettyDetails, result) {
    super(`One or more branches were not updated: ${prettyDetails}`);
    this.code = this.name = GitPushError.code;
    this.data = { prettyDetails, result };
  }
}
/** @type {'GitPushError'} */
GitPushError.code = 'GitPushError';

class HttpError extends BaseError {
  /**
   * @param {number} statusCode
   * @param {string} statusMessage
   * @param {string} response
   */
  constructor(statusCode, statusMessage, response) {
    super(`HTTP Error: ${statusCode} ${statusMessage}`);
    this.code = this.name = HttpError.code;
    this.data = { statusCode, statusMessage, response };
  }
}
/** @type {'HttpError'} */
HttpError.code = 'HttpError';

class InvalidFilepathError extends BaseError {
  /**
   * @param {'leading-slash'|'trailing-slash'|'directory'} [reason]
   */
  constructor(reason) {
    let message = 'invalid filepath';
    if (reason === 'leading-slash' || reason === 'trailing-slash') {
      message = `"filepath" parameter should not include leading or trailing directory separators because these can cause problems on some platforms.`;
    } else if (reason === 'directory') {
      message = `"filepath" should not be a directory.`;
    }
    super(message);
    this.code = this.name = InvalidFilepathError.code;
    this.data = { reason };
  }
}
/** @type {'InvalidFilepathError'} */
InvalidFilepathError.code = 'InvalidFilepathError';

class InvalidRefNameError extends BaseError {
  /**
   * @param {string} ref
   * @param {string} suggestion
   * @param {boolean} canForce
   */
  constructor(ref, suggestion) {
    super(
      `"${ref}" would be an invalid git reference. (Hint: a valid alternative would be "${suggestion}".)`
    );
    this.code = this.name = InvalidRefNameError.code;
    this.data = { ref, suggestion };
  }
}
/** @type {'InvalidRefNameError'} */
InvalidRefNameError.code = 'InvalidRefNameError';

class MaxDepthError extends BaseError {
  /**
   * @param {number} depth
   */
  constructor(depth) {
    super(`Maximum search depth of ${depth} exceeded.`);
    this.code = this.name = MaxDepthError.code;
    this.data = { depth };
  }
}
/** @type {'MaxDepthError'} */
MaxDepthError.code = 'MaxDepthError';

class MergeNotSupportedError extends BaseError {
  constructor() {
    super(`Merges with conflicts are not supported yet.`);
    this.code = this.name = MergeNotSupportedError.code;
    this.data = {};
  }
}
/** @type {'MergeNotSupportedError'} */
MergeNotSupportedError.code = 'MergeNotSupportedError';

class MergeConflictError extends BaseError {
  /**
   * @param {Array<string>} filepaths
   */
  constructor(filepaths) {
    super(
      `Automatic merge failed with one or more merge conflicts in the following files: ${filepaths.toString()}. Fix conflicts then commit the result.`
    );
    this.code = this.name = MergeConflictError.code;
    this.data = { filepaths };
  }
}
/** @type {'MergeConflictError'} */
MergeConflictError.code = 'MergeConflictError';

class MissingNameError extends BaseError {
  /**
   * @param {'author'|'committer'|'tagger'} role
   */
  constructor(role) {
    super(
      `No name was provided for ${role} in the argument or in the .git/config file.`
    );
    this.code = this.name = MissingNameError.code;
    this.data = { role };
  }
}
/** @type {'MissingNameError'} */
MissingNameError.code = 'MissingNameError';

class MissingParameterError extends BaseError {
  /**
   * @param {string} parameter
   */
  constructor(parameter) {
    super(
      `The function requires a "${parameter}" parameter but none was provided.`
    );
    this.code = this.name = MissingParameterError.code;
    this.data = { parameter };
  }
}
/** @type {'MissingParameterError'} */
MissingParameterError.code = 'MissingParameterError';

class MultipleGitError extends BaseError {
  /**
   * @param {Error[]} errors
   * @param {string} message
   */
  constructor(errors) {
    super(
      `There are multiple errors that were thrown by the method. Please refer to the "errors" property to see more`
    );
    this.code = this.name = MultipleGitError.code;
    this.data = { errors };
    this.errors = errors;
  }
}
/** @type {'MultipleGitError'} */
MultipleGitError.code = 'MultipleGitError';

class ParseError extends BaseError {
  /**
   * @param {string} expected
   * @param {string} actual
   */
  constructor(expected, actual) {
    super(`Expected "${expected}" but received "${actual}".`);
    this.code = this.name = ParseError.code;
    this.data = { expected, actual };
  }
}
/** @type {'ParseError'} */
ParseError.code = 'ParseError';

class PushRejectedError extends BaseError {
  /**
   * @param {'not-fast-forward'|'tag-exists'} reason
   */
  constructor(reason) {
    let message = '';
    if (reason === 'not-fast-forward') {
      message = ' because it was not a simple fast-forward';
    } else if (reason === 'tag-exists') {
      message = ' because tag already exists';
    }
    super(`Push rejected${message}. Use "force: true" to override.`);
    this.code = this.name = PushRejectedError.code;
    this.data = { reason };
  }
}
/** @type {'PushRejectedError'} */
PushRejectedError.code = 'PushRejectedError';

class RemoteCapabilityError extends BaseError {
  /**
   * @param {'shallow'|'deepen-since'|'deepen-not'|'deepen-relative'} capability
   * @param {'depth'|'since'|'exclude'|'relative'} parameter
   */
  constructor(capability, parameter) {
    super(
      `Remote does not support the "${capability}" so the "${parameter}" parameter cannot be used.`
    );
    this.code = this.name = RemoteCapabilityError.code;
    this.data = { capability, parameter };
  }
}
/** @type {'RemoteCapabilityError'} */
RemoteCapabilityError.code = 'RemoteCapabilityError';

class SmartHttpError extends BaseError {
  /**
   * @param {string} preview
   * @param {string} response
   */
  constructor(preview, response) {
    super(
      `Remote did not reply using the "smart" HTTP protocol. Expected "001e# service=git-upload-pack" but received: ${preview}`
    );
    this.code = this.name = SmartHttpError.code;
    this.data = { preview, response };
  }
}
/** @type {'SmartHttpError'} */
SmartHttpError.code = 'SmartHttpError';

class UnknownTransportError extends BaseError {
  /**
   * @param {string} url
   * @param {string} transport
   * @param {string} [suggestion]
   */
  constructor(url, transport, suggestion) {
    super(
      `Git remote "${url}" uses an unrecognized transport protocol: "${transport}"`
    );
    this.code = this.name = UnknownTransportError.code;
    this.data = { url, transport, suggestion };
  }
}
/** @type {'UnknownTransportError'} */
UnknownTransportError.code = 'UnknownTransportError';

class UrlParseError extends BaseError {
  /**
   * @param {string} url
   */
  constructor(url) {
    super(`Cannot parse remote URL: "${url}"`);
    this.code = this.name = UrlParseError.code;
    this.data = { url };
  }
}
/** @type {'UrlParseError'} */
UrlParseError.code = 'UrlParseError';

class UserCanceledError extends BaseError {
  constructor() {
    super(`The operation was canceled.`);
    this.code = this.name = UserCanceledError.code;
    this.data = {};
  }
}
/** @type {'UserCanceledError'} */
UserCanceledError.code = 'UserCanceledError';



var Errors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AlreadyExistsError: AlreadyExistsError,
  AmbiguousError: AmbiguousError,
  CheckoutConflictError: CheckoutConflictError,
  CommitNotFetchedError: CommitNotFetchedError,
  EmptyServerResponseError: EmptyServerResponseError,
  FastForwardError: FastForwardError,
  GitPushError: GitPushError,
  HttpError: HttpError,
  InternalError: InternalError,
  InvalidFilepathError: InvalidFilepathError,
  InvalidOidError: InvalidOidError,
  InvalidRefNameError: InvalidRefNameError,
  MaxDepthError: MaxDepthError,
  MergeNotSupportedError: MergeNotSupportedError,
  MergeConflictError: MergeConflictError,
  MissingNameError: MissingNameError,
  MissingParameterError: MissingParameterError,
  MultipleGitError: MultipleGitError,
  NoRefspecError: NoRefspecError,
  NotFoundError: NotFoundError,
  ObjectTypeError: ObjectTypeError,
  ParseError: ParseError,
  PushRejectedError: PushRejectedError,
  RemoteCapabilityError: RemoteCapabilityError,
  SmartHttpError: SmartHttpError,
  UnknownTransportError: UnknownTransportError,
  UnsafeFilepathError: UnsafeFilepathError,
  UrlParseError: UrlParseError,
  UserCanceledError: UserCanceledError
});

function formatAuthor({ name, email, timestamp, timezoneOffset }) {
  timezoneOffset = formatTimezoneOffset(timezoneOffset);
  return `${name} <${email}> ${timestamp} ${timezoneOffset}`
}

// The amount of effort that went into crafting these cases to handle
// -0 (just so we don't lose that information when parsing and reconstructing)
// but can also default to +0 was extraordinary.

function formatTimezoneOffset(minutes) {
  const sign = simpleSign(negateExceptForZero(minutes));
  minutes = Math.abs(minutes);
  const hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  let strHours = String(hours);
  let strMinutes = String(minutes);
  if (strHours.length < 2) strHours = '0' + strHours;
  if (strMinutes.length < 2) strMinutes = '0' + strMinutes;
  return (sign === -1 ? '-' : '+') + strHours + strMinutes
}

function simpleSign(n) {
  return Math.sign(n) || (Object.is(n, -0) ? -1 : 1)
}

function negateExceptForZero(n) {
  return n === 0 ? n : -n
}

function normalizeNewlines(str) {
  // remove all <CR>
  str = str.replace(/\r/g, '');
  // no extra newlines up front
  str = str.replace(/^\n+/, '');
  // and a single newline at the end
  str = str.replace(/\n+$/, '') + '\n';
  return str
}

function parseAuthor(author) {
  const [, name, email, timestamp, offset] = author.match(
    /^(.*) <(.*)> (.*) (.*)$/
  );
  return {
    name: name,
    email: email,
    timestamp: Number(timestamp),
    timezoneOffset: parseTimezoneOffset(offset),
  }
}

// The amount of effort that went into crafting these cases to handle
// -0 (just so we don't lose that information when parsing and reconstructing)
// but can also default to +0 was extraordinary.

function parseTimezoneOffset(offset) {
  let [, sign, hours, minutes] = offset.match(/(\+|-)(\d\d)(\d\d)/);
  minutes = (sign === '+' ? 1 : -1) * (Number(hours) * 60 + Number(minutes));
  return negateExceptForZero$1(minutes)
}

function negateExceptForZero$1(n) {
  return n === 0 ? n : -n
}

class GitAnnotatedTag {
  constructor(tag) {
    if (typeof tag === 'string') {
      this._tag = tag;
    } else if (Buffer.isBuffer(tag)) {
      this._tag = tag.toString('utf8');
    } else if (typeof tag === 'object') {
      this._tag = GitAnnotatedTag.render(tag);
    } else {
      throw new InternalError(
        'invalid type passed to GitAnnotatedTag constructor'
      )
    }
  }

  static from(tag) {
    return new GitAnnotatedTag(tag)
  }

  static render(obj) {
    return `object ${obj.object}
type ${obj.type}
tag ${obj.tag}
tagger ${formatAuthor(obj.tagger)}

${obj.message}
${obj.gpgsig ? obj.gpgsig : ''}`
  }

  justHeaders() {
    return this._tag.slice(0, this._tag.indexOf('\n\n'))
  }

  message() {
    const tag = this.withoutSignature();
    return tag.slice(tag.indexOf('\n\n') + 2)
  }

  parse() {
    return Object.assign(this.headers(), {
      message: this.message(),
      gpgsig: this.gpgsig(),
    })
  }

  render() {
    return this._tag
  }

  headers() {
    const headers = this.justHeaders().split('\n');
    const hs = [];
    for (const h of headers) {
      if (h[0] === ' ') {
        // combine with previous header (without space indent)
        hs[hs.length - 1] += '\n' + h.slice(1);
      } else {
        hs.push(h);
      }
    }
    const obj = {};
    for (const h of hs) {
      const key = h.slice(0, h.indexOf(' '));
      const value = h.slice(h.indexOf(' ') + 1);
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = value;
      }
    }
    if (obj.tagger) {
      obj.tagger = parseAuthor(obj.tagger);
    }
    if (obj.committer) {
      obj.committer = parseAuthor(obj.committer);
    }
    return obj
  }

  withoutSignature() {
    const tag = normalizeNewlines(this._tag);
    if (tag.indexOf('\n-----BEGIN PGP SIGNATURE-----') === -1) return tag
    return tag.slice(0, tag.lastIndexOf('\n-----BEGIN PGP SIGNATURE-----'))
  }

  gpgsig() {
    if (this._tag.indexOf('\n-----BEGIN PGP SIGNATURE-----') === -1) return
    const signature = this._tag.slice(
      this._tag.indexOf('-----BEGIN PGP SIGNATURE-----'),
      this._tag.indexOf('-----END PGP SIGNATURE-----') +
        '-----END PGP SIGNATURE-----'.length
    );
    return normalizeNewlines(signature)
  }

  payload() {
    return this.withoutSignature() + '\n'
  }

  toObject() {
    return Buffer.from(this._tag, 'utf8')
  }

  static async sign(tag, sign, secretKey) {
    const payload = tag.payload();
    let { signature } = await sign({ payload, secretKey });
    // renormalize the line endings to the one true line-ending
    signature = normalizeNewlines(signature);
    const signedTag = payload + signature;
    // return a new tag object
    return GitAnnotatedTag.from(signedTag)
  }
}

function indent(str) {
  return (
    str
      .trim()
      .split('\n')
      .map(x => ' ' + x)
      .join('\n') + '\n'
  )
}

function outdent(str) {
  return str
    .split('\n')
    .map(x => x.replace(/^ /, ''))
    .join('\n')
}

class GitCommit {
  constructor(commit) {
    if (typeof commit === 'string') {
      this._commit = commit;
    } else if (Buffer.isBuffer(commit)) {
      this._commit = commit.toString('utf8');
    } else if (typeof commit === 'object') {
      this._commit = GitCommit.render(commit);
    } else {
      throw new InternalError('invalid type passed to GitCommit constructor')
    }
  }

  static fromPayloadSignature({ payload, signature }) {
    const headers = GitCommit.justHeaders(payload);
    const message = GitCommit.justMessage(payload);
    const commit = normalizeNewlines(
      headers + '\ngpgsig' + indent(signature) + '\n' + message
    );
    return new GitCommit(commit)
  }

  static from(commit) {
    return new GitCommit(commit)
  }

  toObject() {
    return Buffer.from(this._commit, 'utf8')
  }

  // Todo: allow setting the headers and message
  headers() {
    return this.parseHeaders()
  }

  // Todo: allow setting the headers and message
  message() {
    return GitCommit.justMessage(this._commit)
  }

  parse() {
    return Object.assign({ message: this.message() }, this.headers())
  }

  static justMessage(commit) {
    return normalizeNewlines(commit.slice(commit.indexOf('\n\n') + 2))
  }

  static justHeaders(commit) {
    return commit.slice(0, commit.indexOf('\n\n'))
  }

  parseHeaders() {
    const headers = GitCommit.justHeaders(this._commit).split('\n');
    const hs = [];
    for (const h of headers) {
      if (h[0] === ' ') {
        // combine with previous header (without space indent)
        hs[hs.length - 1] += '\n' + h.slice(1);
      } else {
        hs.push(h);
      }
    }
    const obj = {
      parent: [],
    };
    for (const h of hs) {
      const key = h.slice(0, h.indexOf(' '));
      const value = h.slice(h.indexOf(' ') + 1);
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = value;
      }
    }
    if (obj.author) {
      obj.author = parseAuthor(obj.author);
    }
    if (obj.committer) {
      obj.committer = parseAuthor(obj.committer);
    }
    return obj
  }

  static renderHeaders(obj) {
    let headers = '';
    if (obj.tree) {
      headers += `tree ${obj.tree}\n`;
    } else {
      headers += `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\n`; // the null tree
    }
    if (obj.parent) {
      if (obj.parent.length === undefined) {
        throw new InternalError(`commit 'parent' property should be an array`)
      }
      for (const p of obj.parent) {
        headers += `parent ${p}\n`;
      }
    }
    const author = obj.author;
    headers += `author ${formatAuthor(author)}\n`;
    const committer = obj.committer || obj.author;
    headers += `committer ${formatAuthor(committer)}\n`;
    if (obj.gpgsig) {
      headers += 'gpgsig' + indent(obj.gpgsig);
    }
    return headers
  }

  static render(obj) {
    return GitCommit.renderHeaders(obj) + '\n' + normalizeNewlines(obj.message)
  }

  render() {
    return this._commit
  }

  withoutSignature() {
    const commit = normalizeNewlines(this._commit);
    if (commit.indexOf('\ngpgsig') === -1) return commit
    const headers = commit.slice(0, commit.indexOf('\ngpgsig'));
    const message = commit.slice(
      commit.indexOf('-----END PGP SIGNATURE-----\n') +
        '-----END PGP SIGNATURE-----\n'.length
    );
    return normalizeNewlines(headers + '\n' + message)
  }

  isolateSignature() {
    const signature = this._commit.slice(
      this._commit.indexOf('-----BEGIN PGP SIGNATURE-----'),
      this._commit.indexOf('-----END PGP SIGNATURE-----') +
        '-----END PGP SIGNATURE-----'.length
    );
    return outdent(signature)
  }

  static async sign(commit, sign, secretKey) {
    const payload = commit.withoutSignature();
    const message = GitCommit.justMessage(commit._commit);
    let { signature } = await sign({ payload, secretKey });
    // renormalize the line endings to the one true line-ending
    signature = normalizeNewlines(signature);
    const headers = GitCommit.justHeaders(commit._commit);
    const signedCommit =
      headers + '\n' + 'gpgsig' + indent(signature) + '\n' + message;
    // return a new commit object
    return GitCommit.from(signedCommit)
  }
}

async function resolveTree({ fs, cache, gitdir, oid }) {
  // Empty tree - bypass `readObject`
  if (oid === '4b825dc642cb6eb9a060e54bf8d69288fbee4904') {
    return { tree: GitTree.from([]), oid }
  }
  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
  // Resolve annotated tag objects to whatever
  if (type === 'tag') {
    oid = GitAnnotatedTag.from(object).parse().object;
    return resolveTree({ fs, cache, gitdir, oid })
  }
  // Resolve commits to trees
  if (type === 'commit') {
    oid = GitCommit.from(object).parse().tree;
    return resolveTree({ fs, cache, gitdir, oid })
  }
  if (type !== 'tree') {
    throw new ObjectTypeError(oid, type, 'tree')
  }
  return { tree: GitTree.from(object), oid }
}

class GitWalkerRepo {
  constructor({ fs, gitdir, ref, cache }) {
    this.fs = fs;
    this.cache = cache;
    this.gitdir = gitdir;
    this.mapPromise = (async () => {
      const map = new Map();
      let oid;
      try {
        oid = await GitRefManager.resolve({ fs, gitdir, ref });
      } catch (e) {
        if (e instanceof NotFoundError) {
          // Handle fresh branches with no commits
          oid = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
        }
      }
      const tree = await resolveTree({ fs, cache: this.cache, gitdir, oid });
      tree.type = 'tree';
      tree.mode = '40000';
      map.set('.', tree);
      return map
    })();
    const walker = this;
    this.ConstructEntry = class TreeEntry {
      constructor(fullpath) {
        this._fullpath = fullpath;
        this._type = false;
        this._mode = false;
        this._stat = false;
        this._content = false;
        this._oid = false;
      }

      async type() {
        return walker.type(this)
      }

      async mode() {
        return walker.mode(this)
      }

      async stat() {
        return walker.stat(this)
      }

      async content() {
        return walker.content(this)
      }

      async oid() {
        return walker.oid(this)
      }
    };
  }

  async readdir(entry) {
    const filepath = entry._fullpath;
    const { fs, cache, gitdir } = this;
    const map = await this.mapPromise;
    const obj = map.get(filepath);
    if (!obj) throw new Error(`No obj for ${filepath}`)
    const oid = obj.oid;
    if (!oid) throw new Error(`No oid for obj ${JSON.stringify(obj)}`)
    if (obj.type !== 'tree') {
      // TODO: support submodules (type === 'commit')
      return null
    }
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    if (type !== obj.type) {
      throw new ObjectTypeError(oid, type, obj.type)
    }
    const tree = GitTree.from(object);
    // cache all entries
    for (const entry of tree) {
      map.set(join(filepath, entry.path), entry);
    }
    return tree.entries().map(entry => join(filepath, entry.path))
  }

  async type(entry) {
    if (entry._type === false) {
      const map = await this.mapPromise;
      const { type } = map.get(entry._fullpath);
      entry._type = type;
    }
    return entry._type
  }

  async mode(entry) {
    if (entry._mode === false) {
      const map = await this.mapPromise;
      const { mode } = map.get(entry._fullpath);
      entry._mode = normalizeMode(parseInt(mode, 8));
    }
    return entry._mode
  }

  async stat(_entry) {}

  async content(entry) {
    if (entry._content === false) {
      const map = await this.mapPromise;
      const { fs, cache, gitdir } = this;
      const obj = map.get(entry._fullpath);
      const oid = obj.oid;
      const { type, object } = await _readObject({ fs, cache, gitdir, oid });
      if (type !== 'blob') {
        entry._content = undefined;
      } else {
        entry._content = new Uint8Array(object);
      }
    }
    return entry._content
  }

  async oid(entry) {
    if (entry._oid === false) {
      const map = await this.mapPromise;
      const obj = map.get(entry._fullpath);
      entry._oid = obj.oid;
    }
    return entry._oid
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {string} [args.ref='HEAD']
 * @returns {Walker}
 */
function TREE({ ref = 'HEAD' } = {}) {
  const o = Object.create(null);
  Object.defineProperty(o, GitWalkSymbol, {
    value: function({ fs, gitdir, cache }) {
      return new GitWalkerRepo({ fs, gitdir, ref, cache })
    },
  });
  Object.freeze(o);
  return o
}

// @ts-check

class GitWalkerFs {
  constructor({ fs, dir, gitdir, cache }) {
    this.fs = fs;
    this.cache = cache;
    this.dir = dir;
    this.gitdir = gitdir;
    const walker = this;
    this.ConstructEntry = class WorkdirEntry {
      constructor(fullpath) {
        this._fullpath = fullpath;
        this._type = false;
        this._mode = false;
        this._stat = false;
        this._content = false;
        this._oid = false;
      }

      async type() {
        return walker.type(this)
      }

      async mode() {
        return walker.mode(this)
      }

      async stat() {
        return walker.stat(this)
      }

      async content() {
        return walker.content(this)
      }

      async oid() {
        return walker.oid(this)
      }
    };
  }

  async readdir(entry) {
    const filepath = entry._fullpath;
    const { fs, dir } = this;
    const names = await fs.readdir(join(dir, filepath));
    if (names === null) return null
    return names.map(name => join(filepath, name))
  }

  async type(entry) {
    if (entry._type === false) {
      await entry.stat();
    }
    return entry._type
  }

  async mode(entry) {
    if (entry._mode === false) {
      await entry.stat();
    }
    return entry._mode
  }

  async stat(entry) {
    if (entry._stat === false) {
      const { fs, dir } = this;
      let stat = await fs.lstat(`${dir}/${entry._fullpath}`);
      if (!stat) {
        throw new Error(
          `ENOENT: no such file or directory, lstat '${entry._fullpath}'`
        )
      }
      let type = stat.isDirectory() ? 'tree' : 'blob';
      if (type === 'blob' && !stat.isFile() && !stat.isSymbolicLink()) {
        type = 'special';
      }
      entry._type = type;
      stat = normalizeStats(stat);
      entry._mode = stat.mode;
      // workaround for a BrowserFS edge case
      if (stat.size === -1 && entry._actualSize) {
        stat.size = entry._actualSize;
      }
      entry._stat = stat;
    }
    return entry._stat
  }

  async content(entry) {
    if (entry._content === false) {
      const { fs, dir } = this;
      if ((await entry.type()) === 'tree') {
        entry._content = undefined;
      } else {
        const content = await fs.read(`${dir}/${entry._fullpath}`);
        // workaround for a BrowserFS edge case
        entry._actualSize = content.length;
        if (entry._stat && entry._stat.size === -1) {
          entry._stat.size = entry._actualSize;
        }
        entry._content = new Uint8Array(content);
      }
    }
    return entry._content
  }

  async oid(entry) {
    if (entry._oid === false) {
      const { fs, gitdir, cache } = this;
      let oid;
      // See if we can use the SHA1 hash in the index.
      await GitIndexManager.acquire({ fs, gitdir, cache }, async function(
        index
      ) {
        const stage = index.entriesMap.get(entry._fullpath);
        const stats = await entry.stat();
        if (!stage || compareStats(stats, stage)) {
          const content = await entry.content();
          if (content === undefined) {
            oid = undefined;
          } else {
            oid = await shasum(
              GitObject.wrap({ type: 'blob', object: await entry.content() })
            );
            // Update the stats in the index so we will get a "cache hit" next time
            // 1) if we can (because the oid and mode are the same)
            // 2) and only if we need to (because other stats differ)
            if (
              stage &&
              oid === stage.oid &&
              stats.mode === stage.mode &&
              compareStats(stats, stage)
            ) {
              index.insert({
                filepath: entry._fullpath,
                stats,
                oid: oid,
              });
            }
          }
        } else {
          // Use the index SHA1 rather than compute it
          oid = stage.oid;
        }
      });
      entry._oid = oid;
    }
    return entry._oid
  }
}

// @ts-check

/**
 * @returns {Walker}
 */
function WORKDIR() {
  const o = Object.create(null);
  Object.defineProperty(o, GitWalkSymbol, {
    value: function({ fs, dir, gitdir, cache }) {
      return new GitWalkerFs({ fs, dir, gitdir, cache })
    },
  });
  Object.freeze(o);
  return o
}

// @ts-check

// I'm putting this in a Manager because I reckon it could benefit
// from a LOT of cacheing.
class GitIgnoreManager {
  static async isIgnored({ fs, dir, gitdir = join(dir, '.git'), filepath }) {
    // ALWAYS ignore ".git" folders.
    if (basename(filepath) === '.git') return true
    // '.' is not a valid gitignore entry, so '.' is never ignored
    if (filepath === '.') return false
    // Check and load exclusion rules from project exclude file (.git/info/exclude)
    let excludes = '';
    const excludesFile = join(gitdir, 'info', 'exclude');
    if (await fs.exists(excludesFile)) {
      excludes = await fs.read(excludesFile, 'utf8');
    }
    // Find all the .gitignore files that could affect this file
    const pairs = [
      {
        gitignore: join(dir, '.gitignore'),
        filepath,
      },
    ];
    const pieces = filepath.split('/').filter(Boolean);
    for (let i = 1; i < pieces.length; i++) {
      const folder = pieces.slice(0, i).join('/');
      const file = pieces.slice(i).join('/');
      pairs.push({
        gitignore: join(dir, folder, '.gitignore'),
        filepath: file,
      });
    }
    let ignoredStatus = false;
    for (const p of pairs) {
      let file;
      try {
        file = await fs.read(p.gitignore, 'utf8');
      } catch (err) {
        if (err.code === 'NOENT') continue
      }
      const ign = ignore().add(excludes);
      ign.add(file);
      // If the parent directory is excluded, we are done.
      // "It is not possible to re-include a file if a parent directory of that file is excluded. Git doesn’t list excluded directories for performance reasons, so any patterns on contained files have no effect, no matter where they are defined."
      // source: https://git-scm.com/docs/gitignore
      const parentdir = dirname(p.filepath);
      if (parentdir !== '.' && ign.ignores(parentdir)) return true
      // If the file is currently ignored, test for UNignoring.
      if (ignoredStatus) {
        ignoredStatus = !ign.test(p.filepath).unignored;
      } else {
        ignoredStatus = ign.test(p.filepath).ignored;
      }
    }
    return ignoredStatus
  }
}

/**
 * Removes the directory at the specified filepath recursively. Used internally to replicate the behavior of
 * fs.promises.rm({ recursive: true, force: true }) from Node.js 14 and above when not available. If the provided
 * filepath resolves to a file, it will be removed.
 *
 * @param {import('../models/FileSystem.js').FileSystem} fs
 * @param {string} filepath - The file or directory to remove.
 */
async function rmRecursive(fs, filepath) {
  const entries = await fs.readdir(filepath);
  if (entries == null) {
    await fs.rm(filepath);
  } else if (entries.length) {
    await Promise.all(
      entries.map(entry => {
        const subpath = join(filepath, entry);
        return fs.lstat(subpath).then(stat => {
          if (!stat) return
          return stat.isDirectory() ? rmRecursive(fs, subpath) : fs.rm(subpath)
        })
      })
    ).then(() => fs.rmdir(filepath));
  } else {
    await fs.rmdir(filepath);
  }
}

/**
 * This is just a collection of helper functions really. At least that's how it started.
 */
class FileSystem {
  constructor(fs) {
    if (typeof fs._original_unwrapped_fs !== 'undefined') return fs

    const promises = Object.getOwnPropertyDescriptor(fs, 'promises');
    if (promises && promises.enumerable) {
      this._readFile = fs.promises.readFile.bind(fs.promises);
      this._writeFile = fs.promises.writeFile.bind(fs.promises);
      this._mkdir = fs.promises.mkdir.bind(fs.promises);
      if (fs.promises.rm) {
        this._rm = fs.promises.rm.bind(fs.promises);
      } else if (fs.promises.rmdir.length > 1) {
        this._rm = fs.promises.rmdir.bind(fs.promises);
      } else {
        this._rm = rmRecursive.bind(null, this);
      }
      this._rmdir = fs.promises.rmdir.bind(fs.promises);
      this._unlink = fs.promises.unlink.bind(fs.promises);
      this._stat = fs.promises.stat.bind(fs.promises);
      this._lstat = fs.promises.lstat.bind(fs.promises);
      this._readdir = fs.promises.readdir.bind(fs.promises);
      this._readlink = fs.promises.readlink.bind(fs.promises);
      this._symlink = fs.promises.symlink.bind(fs.promises);
    } else {
      this._readFile = pify(fs.readFile.bind(fs));
      this._writeFile = pify(fs.writeFile.bind(fs));
      this._mkdir = pify(fs.mkdir.bind(fs));
      if (fs.rm) {
        this._rm = pify(fs.rm.bind(fs));
      } else if (fs.rmdir.length > 2) {
        this._rm = pify(fs.rmdir.bind(fs));
      } else {
        this._rm = rmRecursive.bind(null, this);
      }
      this._rmdir = pify(fs.rmdir.bind(fs));
      this._unlink = pify(fs.unlink.bind(fs));
      this._stat = pify(fs.stat.bind(fs));
      this._lstat = pify(fs.lstat.bind(fs));
      this._readdir = pify(fs.readdir.bind(fs));
      this._readlink = pify(fs.readlink.bind(fs));
      this._symlink = pify(fs.symlink.bind(fs));
    }
    this._original_unwrapped_fs = fs;
  }

  /**
   * Return true if a file exists, false if it doesn't exist.
   * Rethrows errors that aren't related to file existance.
   */
  async exists(filepath, options = {}) {
    try {
      await this._stat(filepath);
      return true
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
        return false
      } else {
        console.log('Unhandled error in "FileSystem.exists()" function', err);
        throw err
      }
    }
  }

  /**
   * Return the contents of a file if it exists, otherwise returns null.
   *
   * @param {string} filepath
   * @param {object} [options]
   *
   * @returns {Promise<Buffer|string|null>}
   */
  async read(filepath, options = {}) {
    try {
      let buffer = await this._readFile(filepath, options);
      // Convert plain ArrayBuffers to Buffers
      if (typeof buffer !== 'string') {
        buffer = Buffer.from(buffer);
      }
      return buffer
    } catch (err) {
      return null
    }
  }

  /**
   * Write a file (creating missing directories if need be) without throwing errors.
   *
   * @param {string} filepath
   * @param {Buffer|Uint8Array|string} contents
   * @param {object|string} [options]
   */
  async write(filepath, contents, options = {}) {
    try {
      await this._writeFile(filepath, contents, options);
      return
    } catch (err) {
      // Hmm. Let's try mkdirp and try again.
      await this.mkdir(dirname(filepath));
      await this._writeFile(filepath, contents, options);
    }
  }

  /**
   * Make a directory (or series of nested directories) without throwing an error if it already exists.
   */
  async mkdir(filepath, _selfCall = false) {
    try {
      await this._mkdir(filepath);
      return
    } catch (err) {
      // If err is null then operation succeeded!
      if (err === null) return
      // If the directory already exists, that's OK!
      if (err.code === 'EEXIST') return
      // Avoid infinite loops of failure
      if (_selfCall) throw err
      // If we got a "no such file or directory error" backup and try again.
      if (err.code === 'ENOENT') {
        const parent = dirname(filepath);
        // Check to see if we've gone too far
        if (parent === '.' || parent === '/' || parent === filepath) throw err
        // Infinite recursion, what could go wrong?
        await this.mkdir(parent);
        await this.mkdir(filepath, true);
      }
    }
  }

  /**
   * Delete a file without throwing an error if it is already deleted.
   */
  async rm(filepath) {
    try {
      await this._unlink(filepath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }

  /**
   * Delete a directory without throwing an error if it is already deleted.
   */
  async rmdir(filepath, opts) {
    try {
      if (opts && opts.recursive) {
        await this._rm(filepath, opts);
      } else {
        await this._rmdir(filepath);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }

  /**
   * Read a directory without throwing an error is the directory doesn't exist
   */
  async readdir(filepath) {
    try {
      const names = await this._readdir(filepath);
      // Ordering is not guaranteed, and system specific (Windows vs Unix)
      // so we must sort them ourselves.
      names.sort(compareStrings);
      return names
    } catch (err) {
      if (err.code === 'ENOTDIR') return null
      return []
    }
  }

  /**
   * Return a flast list of all the files nested inside a directory
   *
   * Based on an elegant concurrent recursive solution from SO
   * https://stackoverflow.com/a/45130990/2168416
   */
  async readdirDeep(dir) {
    const subdirs = await this._readdir(dir);
    const files = await Promise.all(
      subdirs.map(async subdir => {
        const res = dir + '/' + subdir;
        return (await this._stat(res)).isDirectory()
          ? this.readdirDeep(res)
          : res
      })
    );
    return files.reduce((a, f) => a.concat(f), [])
  }

  /**
   * Return the Stats of a file/symlink if it exists, otherwise returns null.
   * Rethrows errors that aren't related to file existance.
   */
  async lstat(filename) {
    try {
      const stats = await this._lstat(filename);
      return stats
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null
      }
      throw err
    }
  }

  /**
   * Reads the contents of a symlink if it exists, otherwise returns null.
   * Rethrows errors that aren't related to file existance.
   */
  async readlink(filename, opts = { encoding: 'buffer' }) {
    // Note: FileSystem.readlink returns a buffer by default
    // so we can dump it into GitObject.write just like any other file.
    try {
      const link = await this._readlink(filename, opts);
      return Buffer.isBuffer(link) ? link : Buffer.from(link)
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null
      }
      throw err
    }
  }

  /**
   * Write the contents of buffer to a symlink.
   */
  async writelink(filename, buffer) {
    return this._symlink(buffer.toString('utf8'), filename)
  }
}

async function writeObjectLoose({ fs, gitdir, object, format, oid }) {
  if (format !== 'deflated') {
    throw new InternalError(
      'GitObjectStoreLoose expects objects to write to be in deflated format'
    )
  }
  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
  const filepath = `${gitdir}/${source}`;
  // Don't overwrite existing git objects - this helps avoid EPERM errors.
  // Although I don't know how we'd fix corrupted objects then. Perhaps delete them
  // on read?
  if (!(await fs.exists(filepath))) await fs.write(filepath, object);
}

/* eslint-env node, browser */

let supportsCompressionStream = null;

async function deflate(buffer) {
  if (supportsCompressionStream === null) {
    supportsCompressionStream = testCompressionStream();
  }
  return supportsCompressionStream
    ? browserDeflate(buffer)
    : pako.deflate(buffer)
}

async function browserDeflate(buffer) {
  const cs = new CompressionStream('deflate');
  const c = new Blob([buffer]).stream().pipeThrough(cs);
  return new Uint8Array(await new Response(c).arrayBuffer())
}

function testCompressionStream() {
  try {
    const cs = new CompressionStream('deflate');
    // Test if `Blob.stream` is present. React Native does not have the `stream` method
    new Blob([]).stream();
    if (cs) return true
  } catch (_) {
    // no bother
  }
  return false
}

async function _writeObject({
  fs,
  gitdir,
  type,
  object,
  format = 'content',
  oid = undefined,
  dryRun = false,
}) {
  if (format !== 'deflated') {
    if (format !== 'wrapped') {
      object = GitObject.wrap({ type, object });
    }
    oid = await shasum(object);
    object = Buffer.from(await deflate(object));
  }
  if (!dryRun) {
    await writeObjectLoose({ fs, gitdir, object, format: 'deflated', oid });
  }
  return oid
}

function assertParameter(name, value) {
  if (value === undefined) {
    throw new MissingParameterError(name)
  }
}

function posixifyPathBuffer(buffer) {
  let idx;
  while (~(idx = buffer.indexOf(92))) buffer[idx] = 47;
  return buffer
}

// @ts-check

/**
 * Add a file to the git index (aka staging area)
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} args.dir - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string|string[]} args.filepath - The path to the file to add to the index
 * @param {object} [args.cache] - a [cache](cache.md) object
 * @param {boolean} [args.force=false] - add to index even if matches gitignore. Think `git add --force`
 *
 * @returns {Promise<void>} Resolves successfully once the git index has been updated
 *
 * @example
 * await fs.promises.writeFile('/tutorial/README.md', `# TEST`)
 * await git.add({ fs, dir: '/tutorial', filepath: 'README.md' })
 * console.log('done')
 *
 */
async function add({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  filepath,
  cache = {},
  force = false,
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('dir', dir);
    assertParameter('gitdir', gitdir);
    assertParameter('filepath', filepath);

    const fs = new FileSystem(_fs);
    await GitIndexManager.acquire({ fs, gitdir, cache }, async index => {
      return addToIndex({ dir, gitdir, fs, filepath, index, force })
    });
  } catch (err) {
    err.caller = 'git.add';
    throw err
  }
}

async function addToIndex({ dir, gitdir, fs, filepath, index, force }) {
  // TODO: Should ignore UNLESS it's already in the index.
  filepath = Array.isArray(filepath) ? filepath : [filepath];
  const promises = filepath.map(async currentFilepath => {
    if (!force) {
      const ignored = await GitIgnoreManager.isIgnored({
        fs,
        dir,
        gitdir,
        filepath: currentFilepath,
      });
      if (ignored) return
    }
    const stats = await fs.lstat(join(dir, currentFilepath));
    if (!stats) throw new NotFoundError(currentFilepath)

    if (stats.isDirectory()) {
      const children = await fs.readdir(join(dir, currentFilepath));
      const promises = children.map(child =>
        addToIndex({
          dir,
          gitdir,
          fs,
          filepath: [join(currentFilepath, child)],
          index,
          force,
        })
      );
      await Promise.all(promises);
    } else {
      const object = stats.isSymbolicLink()
        ? await fs.readlink(join(dir, currentFilepath)).then(posixifyPathBuffer)
        : await fs.read(join(dir, currentFilepath));
      if (object === null) throw new NotFoundError(currentFilepath)
      const oid = await _writeObject({ fs, gitdir, type: 'blob', object });
      index.insert({ filepath: currentFilepath, stats, oid });
    }
  });

  const settledPromises = await Promise.allSettled(promises);
  const rejectedPromises = settledPromises
    .filter(settle => settle.status === 'rejected')
    .map(settle => settle.reason);
  if (rejectedPromises.length > 1) {
    throw new MultipleGitError(rejectedPromises)
  }
  if (rejectedPromises.length === 1) {
    throw rejectedPromises[0]
  }

  const fulfilledPromises = settledPromises
    .filter(settle => settle.status === 'fulfilled' && settle.value)
    .map(settle => settle.value);

  return fulfilledPromises
}

// @ts-check

/**
 *
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {SignCallback} [args.onSign]
 * @param {string} args.gitdir
 * @param {string} args.message
 * @param {Object} args.author
 * @param {string} args.author.name
 * @param {string} args.author.email
 * @param {number} args.author.timestamp
 * @param {number} args.author.timezoneOffset
 * @param {Object} args.committer
 * @param {string} args.committer.name
 * @param {string} args.committer.email
 * @param {number} args.committer.timestamp
 * @param {number} args.committer.timezoneOffset
 * @param {string} [args.signingKey]
 * @param {boolean} [args.dryRun = false]
 * @param {boolean} [args.noUpdateBranch = false]
 * @param {string} [args.ref]
 * @param {string[]} [args.parent]
 * @param {string} [args.tree]
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the newly created commit.
 */
async function _commit({
  fs,
  cache,
  onSign,
  gitdir,
  message,
  author,
  committer,
  signingKey,
  dryRun = false,
  noUpdateBranch = false,
  ref,
  parent,
  tree,
}) {
  if (!ref) {
    ref = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: 'HEAD',
      depth: 2,
    });
  }

  return GitIndexManager.acquire({ fs, gitdir, cache }, async function(index) {
    const inodes = flatFileListToDirectoryStructure(index.entries);
    const inode = inodes.get('.');
    if (!tree) {
      tree = await constructTree({ fs, gitdir, inode, dryRun });
    }
    if (!parent) {
      try {
        parent = [
          await GitRefManager.resolve({
            fs,
            gitdir,
            ref,
          }),
        ];
      } catch (err) {
        // Probably an initial commit
        parent = [];
      }
    } else {
      // ensure that the parents are oids, not refs
      parent = await Promise.all(
        parent.map(p => {
          return GitRefManager.resolve({ fs, gitdir, ref: p })
        })
      );
    }

    let comm = GitCommit.from({
      tree,
      parent,
      author,
      committer,
      message,
    });
    if (signingKey) {
      comm = await GitCommit.sign(comm, onSign, signingKey);
    }
    const oid = await _writeObject({
      fs,
      gitdir,
      type: 'commit',
      object: comm.toObject(),
      dryRun,
    });
    if (!noUpdateBranch && !dryRun) {
      // Update branch pointer
      await GitRefManager.writeRef({
        fs,
        gitdir,
        ref,
        value: oid,
      });
    }
    return oid
  })
}

async function constructTree({ fs, gitdir, inode, dryRun }) {
  // use depth first traversal
  const children = inode.children;
  for (const inode of children) {
    if (inode.type === 'tree') {
      inode.metadata.mode = '040000';
      inode.metadata.oid = await constructTree({ fs, gitdir, inode, dryRun });
    }
  }
  const entries = children.map(inode => ({
    mode: inode.metadata.mode,
    path: inode.basename,
    oid: inode.metadata.oid,
    type: inode.type,
  }));
  const tree = GitTree.from(entries);
  const oid = await _writeObject({
    fs,
    gitdir,
    type: 'tree',
    object: tree.toObject(),
    dryRun,
  });
  return oid
}

// @ts-check

async function resolveFilepath({ fs, cache, gitdir, oid, filepath }) {
  // Ensure there are no leading or trailing directory separators.
  // I was going to do this automatically, but then found that the Git Terminal for Windows
  // auto-expands --filepath=/src/utils to --filepath=C:/Users/Will/AppData/Local/Programs/Git/src/utils
  // so I figured it would be wise to promote the behavior in the application layer not just the library layer.
  if (filepath.startsWith('/')) {
    throw new InvalidFilepathError('leading-slash')
  } else if (filepath.endsWith('/')) {
    throw new InvalidFilepathError('trailing-slash')
  }
  const _oid = oid;
  const result = await resolveTree({ fs, cache, gitdir, oid });
  const tree = result.tree;
  if (filepath === '') {
    oid = result.oid;
  } else {
    const pathArray = filepath.split('/');
    oid = await _resolveFilepath({
      fs,
      cache,
      gitdir,
      tree,
      pathArray,
      oid: _oid,
      filepath,
    });
  }
  return oid
}

async function _resolveFilepath({
  fs,
  cache,
  gitdir,
  tree,
  pathArray,
  oid,
  filepath,
}) {
  const name = pathArray.shift();
  for (const entry of tree) {
    if (entry.path === name) {
      if (pathArray.length === 0) {
        return entry.oid
      } else {
        const { type, object } = await _readObject({
          fs,
          cache,
          gitdir,
          oid: entry.oid,
        });
        if (type !== 'tree') {
          throw new ObjectTypeError(oid, type, 'blob', filepath)
        }
        tree = GitTree.from(object);
        return _resolveFilepath({
          fs,
          cache,
          gitdir,
          tree,
          pathArray,
          oid,
          filepath,
        })
      }
    }
  }
  throw new NotFoundError(`file or directory found at "${oid}:${filepath}"`)
}

// @ts-check

/**
 *
 * @typedef {Object} ReadTreeResult - The object returned has the following schema:
 * @property {string} oid - SHA-1 object id of this tree
 * @property {TreeObject} tree - the parsed tree object
 */

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} args.oid
 * @param {string} [args.filepath]
 *
 * @returns {Promise<ReadTreeResult>}
 */
async function _readTree({
  fs,
  cache,
  gitdir,
  oid,
  filepath = undefined,
}) {
  if (filepath !== undefined) {
    oid = await resolveFilepath({ fs, cache, gitdir, oid, filepath });
  }
  const { tree, oid: treeOid } = await resolveTree({ fs, cache, gitdir, oid });
  const result = {
    oid: treeOid,
    tree: tree.entries(),
  };
  return result
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {TreeObject} args.tree
 *
 * @returns {Promise<string>}
 */
async function _writeTree({ fs, gitdir, tree }) {
  // Convert object to buffer
  const object = GitTree.from(tree).toObject();
  const oid = await _writeObject({
    fs,
    gitdir,
    type: 'tree',
    object,
    format: 'content',
  });
  return oid
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {SignCallback} [args.onSign]
 * @param {string} args.gitdir
 * @param {string} args.ref
 * @param {string} args.oid
 * @param {string|Uint8Array} args.note
 * @param {boolean} [args.force]
 * @param {Object} args.author
 * @param {string} args.author.name
 * @param {string} args.author.email
 * @param {number} args.author.timestamp
 * @param {number} args.author.timezoneOffset
 * @param {Object} args.committer
 * @param {string} args.committer.name
 * @param {string} args.committer.email
 * @param {number} args.committer.timestamp
 * @param {number} args.committer.timezoneOffset
 * @param {string} [args.signingKey]
 *
 * @returns {Promise<string>}
 */

async function _addNote({
  fs,
  cache,
  onSign,
  gitdir,
  ref,
  oid,
  note,
  force,
  author,
  committer,
  signingKey,
}) {
  // Get the current note commit
  let parent;
  try {
    parent = await GitRefManager.resolve({ gitdir, fs, ref });
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err
    }
  }

  // I'm using the "empty tree" magic number here for brevity
  const result = await _readTree({
    fs,
    cache,
    gitdir,
    oid: parent || '4b825dc642cb6eb9a060e54bf8d69288fbee4904',
  });
  let tree = result.tree;

  // Handle the case where a note already exists
  if (force) {
    tree = tree.filter(entry => entry.path !== oid);
  } else {
    for (const entry of tree) {
      if (entry.path === oid) {
        throw new AlreadyExistsError('note', oid)
      }
    }
  }

  // Create the note blob
  if (typeof note === 'string') {
    note = Buffer.from(note, 'utf8');
  }
  const noteOid = await _writeObject({
    fs,
    gitdir,
    type: 'blob',
    object: note,
    format: 'content',
  });

  // Create the new note tree
  tree.push({ mode: '100644', path: oid, oid: noteOid, type: 'blob' });
  const treeOid = await _writeTree({
    fs,
    gitdir,
    tree,
  });

  // Create the new note commit
  const commitOid = await _commit({
    fs,
    cache,
    onSign,
    gitdir,
    ref,
    tree: treeOid,
    parent: parent && [parent],
    message: `Note added by 'isomorphic-git addNote'\n`,
    author,
    committer,
    signingKey,
  });

  return commitOid
}

// @ts-check

/**
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.path
 *
 * @returns {Promise<any>} Resolves with the config value
 *
 * @example
 * // Read config value
 * let value = await git.getConfig({
 *   dir: '$input((/))',
 *   path: '$input((user.name))'
 * })
 * console.log(value)
 *
 */
async function _getConfig({ fs, gitdir, path }) {
  const config = await GitConfigManager.get({ fs, gitdir });
  return config.get(path)
}

/**
 *
 * @returns {Promise<void | {name: string, email: string, date: Date, timestamp: number, timezoneOffset: number }>}
 */
async function normalizeAuthorObject({ fs, gitdir, author = {} }) {
  let { name, email, timestamp, timezoneOffset } = author;
  name = name || (await _getConfig({ fs, gitdir, path: 'user.name' }));
  email = email || (await _getConfig({ fs, gitdir, path: 'user.email' })) || '';

  if (name === undefined) {
    return undefined
  }

  timestamp = timestamp != null ? timestamp : Math.floor(Date.now() / 1000);
  timezoneOffset =
    timezoneOffset != null
      ? timezoneOffset
      : new Date(timestamp * 1000).getTimezoneOffset();

  return { name, email, timestamp, timezoneOffset }
}

/**
 *
 * @returns {Promise<void | {name: string, email: string, timestamp: number, timezoneOffset: number }>}
 */
async function normalizeCommitterObject({
  fs,
  gitdir,
  author,
  committer,
}) {
  committer = Object.assign({}, committer || author);
  // Match committer's date to author's one, if omitted
  if (author) {
    committer.timestamp = committer.timestamp || author.timestamp;
    committer.timezoneOffset = committer.timezoneOffset || author.timezoneOffset;
  }
  committer = await normalizeAuthorObject({ fs, gitdir, author: committer });
  return committer
}

// @ts-check

/**
 * Add or update an object note
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {SignCallback} [args.onSign] - a PGP signing implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref] - The notes ref to look under
 * @param {string} args.oid - The SHA-1 object id of the object to add the note to.
 * @param {string|Uint8Array} args.note - The note to add
 * @param {boolean} [args.force] - Over-write note if it already exists.
 * @param {Object} [args.author] - The details about the author.
 * @param {string} [args.author.name] - Default is `user.name` config.
 * @param {string} [args.author.email] - Default is `user.email` config.
 * @param {number} [args.author.timestamp=Math.floor(Date.now()/1000)] - Set the author timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.author.timezoneOffset] - Set the author timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {Object} [args.committer = author] - The details about the note committer, in the same format as the author parameter. If not specified, the author details are used.
 * @param {string} [args.committer.name] - Default is `user.name` config.
 * @param {string} [args.committer.email] - Default is `user.email` config.
 * @param {number} [args.committer.timestamp=Math.floor(Date.now()/1000)] - Set the committer timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.committer.timezoneOffset] - Set the committer timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {string} [args.signingKey] - Sign the note commit using this private PGP key.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the commit object for the added note.
 */

async function addNote({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, '.git'),
  ref = 'refs/notes/commits',
  oid,
  note,
  force,
  author: _author,
  committer: _committer,
  signingKey,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);
    assertParameter('note', note);
    if (signingKey) {
      assertParameter('onSign', onSign);
    }
    const fs = new FileSystem(_fs);

    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author) throw new MissingNameError('author')

    const committer = await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer,
    });
    if (!committer) throw new MissingNameError('committer')

    return await _addNote({
      fs: new FileSystem(fs),
      cache,
      onSign,
      gitdir,
      ref,
      oid,
      note,
      force,
      author,
      committer,
      signingKey,
    })
  } catch (err) {
    err.caller = 'git.addNote';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.remote
 * @param {string} args.url
 * @param {boolean} args.force
 *
 * @returns {Promise<void>}
 *
 */
async function _addRemote({ fs, gitdir, remote, url, force }) {
  if (remote !== cleanGitRef.clean(remote)) {
    throw new InvalidRefNameError(remote, cleanGitRef.clean(remote))
  }
  const config = await GitConfigManager.get({ fs, gitdir });
  if (!force) {
    // Check that setting it wouldn't overwrite.
    const remoteNames = await config.getSubsections('remote');
    if (remoteNames.includes(remote)) {
      // Throw an error if it would overwrite an existing remote,
      // but not if it's simply setting the same value again.
      if (url !== (await config.get(`remote.${remote}.url`))) {
        throw new AlreadyExistsError('remote', remote)
      }
    }
  }
  await config.set(`remote.${remote}.url`, url);
  await config.set(
    `remote.${remote}.fetch`,
    `+refs/heads/*:refs/remotes/${remote}/*`
  );
  await GitConfigManager.save({ fs, gitdir, config });
}

// @ts-check

/**
 * Add or update a remote
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.remote - The name of the remote
 * @param {string} args.url - The URL of the remote
 * @param {boolean} [args.force = false] - Instead of throwing an error if a remote named `remote` already exists, overwrite the existing remote.
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.addRemote({
 *   fs,
 *   dir: '/tutorial',
 *   remote: 'upstream',
 *   url: 'https://github.com/isomorphic-git/isomorphic-git'
 * })
 * console.log('done')
 *
 */
async function addRemote({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  remote,
  url,
  force = false,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('remote', remote);
    assertParameter('url', url);
    return await _addRemote({
      fs: new FileSystem(fs),
      gitdir,
      remote,
      url,
      force,
    })
  } catch (err) {
    err.caller = 'git.addRemote';
    throw err
  }
}

// @ts-check

/**
 * Create an annotated tag.
 *
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {SignCallback} [args.onSign]
 * @param {string} args.gitdir
 * @param {string} args.ref
 * @param {string} [args.message = ref]
 * @param {string} [args.object = 'HEAD']
 * @param {object} [args.tagger]
 * @param {string} args.tagger.name
 * @param {string} args.tagger.email
 * @param {number} args.tagger.timestamp
 * @param {number} args.tagger.timezoneOffset
 * @param {string} [args.gpgsig]
 * @param {string} [args.signingKey]
 * @param {boolean} [args.force = false]
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.annotatedTag({
 *   dir: '$input((/))',
 *   ref: '$input((test-tag))',
 *   message: '$input((This commit is awesome))',
 *   tagger: {
 *     name: '$input((Mr. Test))',
 *     email: '$input((mrtest@example.com))'
 *   }
 * })
 * console.log('done')
 *
 */
async function _annotatedTag({
  fs,
  cache,
  onSign,
  gitdir,
  ref,
  tagger,
  message = ref,
  gpgsig,
  object,
  signingKey,
  force = false,
}) {
  ref = ref.startsWith('refs/tags/') ? ref : `refs/tags/${ref}`;

  if (!force && (await GitRefManager.exists({ fs, gitdir, ref }))) {
    throw new AlreadyExistsError('tag', ref)
  }

  // Resolve passed value
  const oid = await GitRefManager.resolve({
    fs,
    gitdir,
    ref: object || 'HEAD',
  });

  const { type } = await _readObject({ fs, cache, gitdir, oid });
  let tagObject = GitAnnotatedTag.from({
    object: oid,
    type,
    tag: ref.replace('refs/tags/', ''),
    tagger,
    message,
    gpgsig,
  });
  if (signingKey) {
    tagObject = await GitAnnotatedTag.sign(tagObject, onSign, signingKey);
  }
  const value = await _writeObject({
    fs,
    gitdir,
    type: 'tag',
    object: tagObject.toObject(),
  });

  await GitRefManager.writeRef({ fs, gitdir, ref, value });
}

// @ts-check

/**
 * Create an annotated tag.
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {SignCallback} [args.onSign] - a PGP signing implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - What to name the tag
 * @param {string} [args.message = ref] - The tag message to use.
 * @param {string} [args.object = 'HEAD'] - The SHA-1 object id the tag points to. (Will resolve to a SHA-1 object id if value is a ref.) By default, the commit object which is referred by the current `HEAD` is used.
 * @param {object} [args.tagger] - The details about the tagger.
 * @param {string} [args.tagger.name] - Default is `user.name` config.
 * @param {string} [args.tagger.email] - Default is `user.email` config.
 * @param {number} [args.tagger.timestamp=Math.floor(Date.now()/1000)] - Set the tagger timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.tagger.timezoneOffset] - Set the tagger timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {string} [args.gpgsig] - The gpgsig attatched to the tag object. (Mutually exclusive with the `signingKey` option.)
 * @param {string} [args.signingKey] - Sign the tag object using this private PGP key. (Mutually exclusive with the `gpgsig` option.)
 * @param {boolean} [args.force = false] - Instead of throwing an error if a tag named `ref` already exists, overwrite the existing tag. Note that this option does not modify the original tag object itself.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.annotatedTag({
 *   fs,
 *   dir: '/tutorial',
 *   ref: 'test-tag',
 *   message: 'This commit is awesome',
 *   tagger: {
 *     name: 'Mr. Test',
 *     email: 'mrtest@example.com'
 *   }
 * })
 * console.log('done')
 *
 */
async function annotatedTag({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  tagger: _tagger,
  message = ref,
  gpgsig,
  object,
  signingKey,
  force = false,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);
    if (signingKey) {
      assertParameter('onSign', onSign);
    }
    const fs = new FileSystem(_fs);

    // Fill in missing arguments with default values
    const tagger = await normalizeAuthorObject({ fs, gitdir, author: _tagger });
    if (!tagger) throw new MissingNameError('tagger')

    return await _annotatedTag({
      fs,
      cache,
      onSign,
      gitdir,
      ref,
      tagger,
      message,
      gpgsig,
      object,
      signingKey,
      force,
    })
  } catch (err) {
    err.caller = 'git.annotatedTag';
    throw err
  }
}

// @ts-check

/**
 * Create a branch
 *
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.ref
 * @param {string} [args.object = 'HEAD']
 * @param {boolean} [args.checkout = false]
 * @param {boolean} [args.force = false]
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.branch({ dir: '$input((/))', ref: '$input((develop))' })
 * console.log('done')
 *
 */
async function _branch({
  fs,
  gitdir,
  ref,
  object,
  checkout = false,
  force = false,
}) {
  if (ref !== cleanGitRef.clean(ref)) {
    throw new InvalidRefNameError(ref, cleanGitRef.clean(ref))
  }

  const fullref = `refs/heads/${ref}`;

  if (!force) {
    const exist = await GitRefManager.exists({ fs, gitdir, ref: fullref });
    if (exist) {
      throw new AlreadyExistsError('branch', ref, false)
    }
  }

  // Get current HEAD tree oid
  let oid;
  try {
    oid = await GitRefManager.resolve({ fs, gitdir, ref: object || 'HEAD' });
  } catch (e) {
    // Probably an empty repo
  }

  // Create a new ref that points at the current commit
  if (oid) {
    await GitRefManager.writeRef({ fs, gitdir, ref: fullref, value: oid });
  }

  if (checkout) {
    // Update HEAD
    await GitRefManager.writeSymbolicRef({
      fs,
      gitdir,
      ref: 'HEAD',
      value: fullref,
    });
  }
}

// @ts-check

/**
 * Create a branch
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - What to name the branch
 * @param {string} [args.object = 'HEAD'] - What oid to use as the start point. Accepts a symbolic ref.
 * @param {boolean} [args.checkout = false] - Update `HEAD` to point at the newly created branch
 * @param {boolean} [args.force = false] - Instead of throwing an error if a branched named `ref` already exists, overwrite the existing branch.
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.branch({ fs, dir: '/tutorial', ref: 'develop' })
 * console.log('done')
 *
 */
async function branch({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  object,
  checkout = false,
  force = false,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);
    return await _branch({
      fs: new FileSystem(fs),
      gitdir,
      ref,
      object,
      checkout,
      force,
    })
  } catch (err) {
    err.caller = 'git.branch';
    throw err
  }
}

// https://dev.to/namirsab/comment/2050
function arrayRange(start, end) {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i)
}

// TODO: Should I just polyfill Array.flat?
const flat =
  typeof Array.prototype.flat === 'undefined'
    ? entries => entries.reduce((acc, x) => acc.concat(x), [])
    : entries => entries.flat();

// This is convenient for computing unions/joins of sorted lists.
class RunningMinimum {
  constructor() {
    // Using a getter for 'value' would just bloat the code.
    // You know better than to set it directly right?
    this.value = null;
  }

  consider(value) {
    if (value === null || value === undefined) return
    if (this.value === null) {
      this.value = value;
    } else if (value < this.value) {
      this.value = value;
    }
  }

  reset() {
    this.value = null;
  }
}

// Take an array of length N of
//   iterators of length Q_n
//     of strings
// and return an iterator of length max(Q_n) for all n
//   of arrays of length N
//     of string|null who all have the same string value
function* unionOfIterators(sets) {
  /* NOTE: We can assume all arrays are sorted.
   * Indexes are sorted because they are defined that way:
   *
   * > Index entries are sorted in ascending order on the name field,
   * > interpreted as a string of unsigned bytes (i.e. memcmp() order, no
   * > localization, no special casing of directory separator '/'). Entries
   * > with the same name are sorted by their stage field.
   *
   * Trees should be sorted because they are created directly from indexes.
   * They definitely should be sorted, or else they wouldn't have a unique SHA1.
   * So that would be very naughty on the part of the tree-creator.
   *
   * Lastly, the working dir entries are sorted because I choose to sort them
   * in my FileSystem.readdir() implementation.
   */

  // Init
  const min = new RunningMinimum();
  let minimum;
  const heads = [];
  const numsets = sets.length;
  for (let i = 0; i < numsets; i++) {
    // Abuse the fact that iterators continue to return 'undefined' for value
    // once they are done
    heads[i] = sets[i].next().value;
    if (heads[i] !== undefined) {
      min.consider(heads[i]);
    }
  }
  if (min.value === null) return
  // Iterate
  while (true) {
    const result = [];
    minimum = min.value;
    min.reset();
    for (let i = 0; i < numsets; i++) {
      if (heads[i] !== undefined && heads[i] === minimum) {
        result[i] = heads[i];
        heads[i] = sets[i].next().value;
      } else {
        // A little hacky, but eh
        result[i] = null;
      }
      if (heads[i] !== undefined) {
        min.consider(heads[i]);
      }
    }
    yield result;
    if (min.value === null) return
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {string} [args.dir]
 * @param {string} [args.gitdir=join(dir,'.git')]
 * @param {Walker[]} args.trees
 * @param {WalkerMap} [args.map]
 * @param {WalkerReduce} [args.reduce]
 * @param {WalkerIterate} [args.iterate]
 *
 * @returns {Promise<any>} The finished tree-walking result
 *
 * @see {WalkerMap}
 *
 */
async function _walk({
  fs,
  cache,
  dir,
  gitdir,
  trees,
  // @ts-ignore
  map = async (_, entry) => entry,
  // The default reducer is a flatmap that filters out undefineds.
  reduce = async (parent, children) => {
    const flatten = flat(children);
    if (parent !== undefined) flatten.unshift(parent);
    return flatten
  },
  // The default iterate function walks all children concurrently
  iterate = (walk, children) => Promise.all([...children].map(walk)),
}) {
  const walkers = trees.map(proxy =>
    proxy[GitWalkSymbol]({ fs, dir, gitdir, cache })
  );

  const root = new Array(walkers.length).fill('.');
  const range = arrayRange(0, walkers.length);
  const unionWalkerFromReaddir = async entries => {
    range.map(i => {
      entries[i] = entries[i] && new walkers[i].ConstructEntry(entries[i]);
    });
    const subdirs = await Promise.all(
      range.map(i => (entries[i] ? walkers[i].readdir(entries[i]) : []))
    );
    // Now process child directories
    const iterators = subdirs
      .map(array => (array === null ? [] : array))
      .map(array => array[Symbol.iterator]());
    return {
      entries,
      children: unionOfIterators(iterators),
    }
  };

  const walk = async root => {
    const { entries, children } = await unionWalkerFromReaddir(root);
    const fullpath = entries.find(entry => entry && entry._fullpath)._fullpath;
    const parent = await map(fullpath, entries);
    if (parent !== null) {
      let walkedChildren = await iterate(walk, children);
      walkedChildren = walkedChildren.filter(x => x !== undefined);
      return reduce(parent, walkedChildren)
    }
  };
  return walk(root)
}

const worthWalking = (filepath, root) => {
  if (filepath === '.' || root == null || root.length === 0 || root === '.') {
    return true
  }
  if (root.length >= filepath.length) {
    return root.startsWith(filepath)
  } else {
    return filepath.startsWith(root)
  }
};

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {ProgressCallback} [args.onProgress]
 * @param {string} args.dir
 * @param {string} args.gitdir
 * @param {string} args.ref
 * @param {string[]} [args.filepaths]
 * @param {string} args.remote
 * @param {boolean} args.noCheckout
 * @param {boolean} [args.noUpdateHead]
 * @param {boolean} [args.dryRun]
 * @param {boolean} [args.force]
 * @param {boolean} [args.track]
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 */
async function _checkout({
  fs,
  cache,
  onProgress,
  dir,
  gitdir,
  remote,
  ref,
  filepaths,
  noCheckout,
  noUpdateHead,
  dryRun,
  force,
  track = true,
}) {
  // Get tree oid
  let oid;
  try {
    oid = await GitRefManager.resolve({ fs, gitdir, ref });
    // TODO: Figure out what to do if both 'ref' and 'remote' are specified, ref already exists,
    // and is configured to track a different remote.
  } catch (err) {
    if (ref === 'HEAD') throw err
    // If `ref` doesn't exist, create a new remote tracking branch
    // Figure out the commit to checkout
    const remoteRef = `${remote}/${ref}`;
    oid = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: remoteRef,
    });
    if (track) {
      // Set up remote tracking branch
      const config = await GitConfigManager.get({ fs, gitdir });
      await config.set(`branch.${ref}.remote`, remote);
      await config.set(`branch.${ref}.merge`, `refs/heads/${ref}`);
      await GitConfigManager.save({ fs, gitdir, config });
    }
    // Create a new branch that points at that same commit
    await GitRefManager.writeRef({
      fs,
      gitdir,
      ref: `refs/heads/${ref}`,
      value: oid,
    });
  }

  // Update working dir
  if (!noCheckout) {
    let ops;
    // First pass - just analyze files (not directories) and figure out what needs to be done
    try {
      ops = await analyze({
        fs,
        cache,
        onProgress,
        dir,
        gitdir,
        ref,
        force,
        filepaths,
      });
    } catch (err) {
      // Throw a more helpful error message for this common mistake.
      if (err instanceof NotFoundError && err.data.what === oid) {
        throw new CommitNotFetchedError(ref, oid)
      } else {
        throw err
      }
    }

    // Report conflicts
    const conflicts = ops
      .filter(([method]) => method === 'conflict')
      .map(([method, fullpath]) => fullpath);
    if (conflicts.length > 0) {
      throw new CheckoutConflictError(conflicts)
    }

    // Collect errors
    const errors = ops
      .filter(([method]) => method === 'error')
      .map(([method, fullpath]) => fullpath);
    if (errors.length > 0) {
      throw new InternalError(errors.join(', '))
    }

    if (dryRun) {
      // Since the format of 'ops' is in flux, I really would rather folk besides myself not start relying on it
      // return ops
      return
    }

    // Second pass - execute planned changes
    // The cheapest semi-parallel solution without computing a full dependency graph will be
    // to just do ops in 4 dumb phases: delete files, delete dirs, create dirs, write files

    let count = 0;
    const total = ops.length;
    await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index) {
      await Promise.all(
        ops
          .filter(
            ([method]) => method === 'delete' || method === 'delete-index'
          )
          .map(async function([method, fullpath]) {
            const filepath = `${dir}/${fullpath}`;
            if (method === 'delete') {
              await fs.rm(filepath);
            }
            index.delete({ filepath: fullpath });
            if (onProgress) {
              await onProgress({
                phase: 'Updating workdir',
                loaded: ++count,
                total,
              });
            }
          })
      );
    });

    // Note: this is cannot be done naively in parallel
    await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index) {
      for (const [method, fullpath] of ops) {
        if (method === 'rmdir' || method === 'rmdir-index') {
          const filepath = `${dir}/${fullpath}`;
          try {
            if (method === 'rmdir-index') {
              index.delete({ filepath: fullpath });
            }
            await fs.rmdir(filepath);
            if (onProgress) {
              await onProgress({
                phase: 'Updating workdir',
                loaded: ++count,
                total,
              });
            }
          } catch (e) {
            if (e.code === 'ENOTEMPTY') {
              console.log(
                `Did not delete ${fullpath} because directory is not empty`
              );
            } else {
              throw e
            }
          }
        }
      }
    });

    await Promise.all(
      ops
        .filter(([method]) => method === 'mkdir' || method === 'mkdir-index')
        .map(async function([_, fullpath]) {
          const filepath = `${dir}/${fullpath}`;
          await fs.mkdir(filepath);
          if (onProgress) {
            await onProgress({
              phase: 'Updating workdir',
              loaded: ++count,
              total,
            });
          }
        })
    );

    await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index) {
      await Promise.all(
        ops
          .filter(
            ([method]) =>
              method === 'create' ||
              method === 'create-index' ||
              method === 'update' ||
              method === 'mkdir-index'
          )
          .map(async function([method, fullpath, oid, mode, chmod]) {
            const filepath = `${dir}/${fullpath}`;
            try {
              if (method !== 'create-index' && method !== 'mkdir-index') {
                const { object } = await _readObject({ fs, cache, gitdir, oid });
                if (chmod) {
                  // Note: the mode option of fs.write only works when creating files,
                  // not updating them. Since the `fs` plugin doesn't expose `chmod` this
                  // is our only option.
                  await fs.rm(filepath);
                }
                if (mode === 0o100644) {
                  // regular file
                  await fs.write(filepath, object);
                } else if (mode === 0o100755) {
                  // executable file
                  await fs.write(filepath, object, { mode: 0o777 });
                } else if (mode === 0o120000) {
                  // symlink
                  await fs.writelink(filepath, object);
                } else {
                  throw new InternalError(
                    `Invalid mode 0o${mode.toString(8)} detected in blob ${oid}`
                  )
                }
              }

              const stats = await fs.lstat(filepath);
              // We can't trust the executable bit returned by lstat on Windows,
              // so we need to preserve this value from the TREE.
              // TODO: Figure out how git handles this internally.
              if (mode === 0o100755) {
                stats.mode = 0o755;
              }
              // Submodules are present in the git index but use a unique mode different from trees
              if (method === 'mkdir-index') {
                stats.mode = 0o160000;
              }
              index.insert({
                filepath: fullpath,
                stats,
                oid,
              });
              if (onProgress) {
                await onProgress({
                  phase: 'Updating workdir',
                  loaded: ++count,
                  total,
                });
              }
            } catch (e) {
              console.log(e);
            }
          })
      );
    });
  }

  // Update HEAD
  if (!noUpdateHead) {
    const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
    if (fullRef.startsWith('refs/heads')) {
      await GitRefManager.writeSymbolicRef({
        fs,
        gitdir,
        ref: 'HEAD',
        value: fullRef,
      });
    } else {
      // detached head
      await GitRefManager.writeRef({ fs, gitdir, ref: 'HEAD', value: oid });
    }
  }
}

async function analyze({
  fs,
  cache,
  onProgress,
  dir,
  gitdir,
  ref,
  force,
  filepaths,
}) {
  let count = 0;
  return _walk({
    fs,
    cache,
    dir,
    gitdir,
    trees: [TREE({ ref }), WORKDIR(), STAGE()],
    map: async function(fullpath, [commit, workdir, stage]) {
      if (fullpath === '.') return
      // match against base paths
      if (filepaths && !filepaths.some(base => worthWalking(fullpath, base))) {
        return null
      }
      // Emit progress event
      if (onProgress) {
        await onProgress({ phase: 'Analyzing workdir', loaded: ++count });
      }

      // This is a kind of silly pattern but it worked so well for me in the past
      // and it makes intuitively demonstrating exhaustiveness so *easy*.
      // This checks for the presense and/or absence of each of the 3 entries,
      // converts that to a 3-bit binary representation, and then handles
      // every possible combination (2^3 or 8 cases) with a lookup table.
      const key = [!!stage, !!commit, !!workdir].map(Number).join('');
      switch (key) {
        // Impossible case.
        case '000':
          return
        // Ignore workdir files that are not tracked and not part of the new commit.
        case '001':
          // OK, make an exception for explicitly named files.
          if (force && filepaths && filepaths.includes(fullpath)) {
            return ['delete', fullpath]
          }
          return
        // New entries
        case '010': {
          switch (await commit.type()) {
            case 'tree': {
              return ['mkdir', fullpath]
            }
            case 'blob': {
              return [
                'create',
                fullpath,
                await commit.oid(),
                await commit.mode(),
              ]
            }
            case 'commit': {
              return [
                'mkdir-index',
                fullpath,
                await commit.oid(),
                await commit.mode(),
              ]
            }
            default: {
              return [
                'error',
                `new entry Unhandled type ${await commit.type()}`,
              ]
            }
          }
        }
        // New entries but there is already something in the workdir there.
        case '011': {
          switch (`${await commit.type()}-${await workdir.type()}`) {
            case 'tree-tree': {
              return // noop
            }
            case 'tree-blob':
            case 'blob-tree': {
              return ['conflict', fullpath]
            }
            case 'blob-blob': {
              // Is the incoming file different?
              if ((await commit.oid()) !== (await workdir.oid())) {
                if (force) {
                  return [
                    'update',
                    fullpath,
                    await commit.oid(),
                    await commit.mode(),
                    (await commit.mode()) !== (await workdir.mode()),
                  ]
                } else {
                  return ['conflict', fullpath]
                }
              } else {
                // Is the incoming file a different mode?
                if ((await commit.mode()) !== (await workdir.mode())) {
                  if (force) {
                    return [
                      'update',
                      fullpath,
                      await commit.oid(),
                      await commit.mode(),
                      true,
                    ]
                  } else {
                    return ['conflict', fullpath]
                  }
                } else {
                  return [
                    'create-index',
                    fullpath,
                    await commit.oid(),
                    await commit.mode(),
                  ]
                }
              }
            }
            case 'commit-tree': {
              // TODO: submodule
              // We'll ignore submodule directories for now.
              // Users prefer we not throw an error for lack of submodule support.
              // gitlinks
              return
            }
            case 'commit-blob': {
              // TODO: submodule
              // But... we'll complain if there is a *file* where we would
              // put a submodule if we had submodule support.
              return ['conflict', fullpath]
            }
            default: {
              return ['error', `new entry Unhandled type ${commit.type}`]
            }
          }
        }
        // Something in stage but not in the commit OR the workdir.
        // Note: I verified this behavior against canonical git.
        case '100': {
          return ['delete-index', fullpath]
        }
        // Deleted entries
        // TODO: How to handle if stage type and workdir type mismatch?
        case '101': {
          switch (await stage.type()) {
            case 'tree': {
              return ['rmdir', fullpath]
            }
            case 'blob': {
              // Git checks that the workdir.oid === stage.oid before deleting file
              if ((await stage.oid()) !== (await workdir.oid())) {
                if (force) {
                  return ['delete', fullpath]
                } else {
                  return ['conflict', fullpath]
                }
              } else {
                return ['delete', fullpath]
              }
            }
            case 'commit': {
              return ['rmdir-index', fullpath]
            }
            default: {
              return [
                'error',
                `delete entry Unhandled type ${await stage.type()}`,
              ]
            }
          }
        }
        /* eslint-disable no-fallthrough */
        // File missing from workdir
        case '110':
        // Possibly modified entries
        case '111': {
          /* eslint-enable no-fallthrough */
          switch (`${await stage.type()}-${await commit.type()}`) {
            case 'tree-tree': {
              return
            }
            case 'blob-blob': {
              // If the file hasn't changed, there is no need to do anything.
              // Existing file modifications in the workdir can be be left as is.
              if (
                (await stage.oid()) === (await commit.oid()) &&
                (await stage.mode()) === (await commit.mode()) &&
                !force
              ) {
                return
              }

              // Check for local changes that would be lost
              if (workdir) {
                // Note: canonical git only compares with the stage. But we're smart enough
                // to compare to the stage AND the incoming commit.
                if (
                  (await workdir.oid()) !== (await stage.oid()) &&
                  (await workdir.oid()) !== (await commit.oid())
                ) {
                  if (force) {
                    return [
                      'update',
                      fullpath,
                      await commit.oid(),
                      await commit.mode(),
                      (await commit.mode()) !== (await workdir.mode()),
                    ]
                  } else {
                    return ['conflict', fullpath]
                  }
                }
              } else if (force) {
                return [
                  'update',
                  fullpath,
                  await commit.oid(),
                  await commit.mode(),
                  (await commit.mode()) !== (await stage.mode()),
                ]
              }
              // Has file mode changed?
              if ((await commit.mode()) !== (await stage.mode())) {
                return [
                  'update',
                  fullpath,
                  await commit.oid(),
                  await commit.mode(),
                  true,
                ]
              }
              // TODO: HANDLE SYMLINKS
              // Has the file content changed?
              if ((await commit.oid()) !== (await stage.oid())) {
                return [
                  'update',
                  fullpath,
                  await commit.oid(),
                  await commit.mode(),
                  false,
                ]
              } else {
                return
              }
            }
            case 'tree-blob': {
              return ['update-dir-to-blob', fullpath, await commit.oid()]
            }
            case 'blob-tree': {
              return ['update-blob-to-tree', fullpath]
            }
            case 'commit-commit': {
              return [
                'mkdir-index',
                fullpath,
                await commit.oid(),
                await commit.mode(),
              ]
            }
            default: {
              return [
                'error',
                `update entry Unhandled type ${await stage.type()}-${await commit.type()}`,
              ]
            }
          }
        }
      }
    },
    // Modify the default flat mapping
    reduce: async function(parent, children) {
      children = flat(children);
      if (!parent) {
        return children
      } else if (parent && parent[0] === 'rmdir') {
        children.push(parent);
        return children
      } else {
        children.unshift(parent);
        return children
      }
    },
  })
}

// @ts-check

/**
 * Checkout a branch
 *
 * If the branch already exists it will check out that branch. Otherwise, it will create a new remote tracking branch set to track the remote branch of that name.
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {ProgressCallback} [args.onProgress] - optional progress event callback
 * @param {string} args.dir - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref = 'HEAD'] - Source to checkout files from
 * @param {string[]} [args.filepaths] - Limit the checkout to the given files and directories
 * @param {string} [args.remote = 'origin'] - Which remote repository to use
 * @param {boolean} [args.noCheckout = false] - If true, will update HEAD but won't update the working directory
 * @param {boolean} [args.noUpdateHead] - If true, will update the working directory but won't update HEAD. Defaults to `false` when `ref` is provided, and `true` if `ref` is not provided.
 * @param {boolean} [args.dryRun = false] - If true, simulates a checkout so you can test whether it would succeed.
 * @param {boolean} [args.force = false] - If true, conflicts will be ignored and files will be overwritten regardless of local changes.
 * @param {boolean} [args.track = true] - If false, will not set the remote branch tracking information. Defaults to true.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * // switch to the main branch
 * await git.checkout({
 *   fs,
 *   dir: '/tutorial',
 *   ref: 'main'
 * })
 * console.log('done')
 *
 * @example
 * // restore the 'docs' and 'src/docs' folders to the way they were, overwriting any changes
 * await git.checkout({
 *   fs,
 *   dir: '/tutorial',
 *   force: true,
 *   filepaths: ['docs', 'src/docs']
 * })
 * console.log('done')
 *
 * @example
 * // restore the 'docs' and 'src/docs' folders to the way they are in the 'develop' branch, overwriting any changes
 * await git.checkout({
 *   fs,
 *   dir: '/tutorial',
 *   ref: 'develop',
 *   noUpdateHead: true,
 *   force: true,
 *   filepaths: ['docs', 'src/docs']
 * })
 * console.log('done')
 */
async function checkout({
  fs,
  onProgress,
  dir,
  gitdir = join(dir, '.git'),
  remote = 'origin',
  ref: _ref,
  filepaths,
  noCheckout = false,
  noUpdateHead = _ref === undefined,
  dryRun = false,
  force = false,
  track = true,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('dir', dir);
    assertParameter('gitdir', gitdir);

    const ref = _ref || 'HEAD';
    return await _checkout({
      fs: new FileSystem(fs),
      cache,
      onProgress,
      dir,
      gitdir,
      remote,
      ref,
      filepaths,
      noCheckout,
      noUpdateHead,
      dryRun,
      force,
      track,
    })
  } catch (err) {
    err.caller = 'git.checkout';
    throw err
  }
}

// @see https://git-scm.com/docs/git-rev-parse.html#_specifying_revisions
const abbreviateRx = new RegExp('^refs/(heads/|tags/|remotes/)?(.*)');

function abbreviateRef(ref) {
  const match = abbreviateRx.exec(ref);
  if (match) {
    if (match[1] === 'remotes/' && ref.endsWith('/HEAD')) {
      return match[2].slice(0, -5)
    } else {
      return match[2]
    }
  }
  return ref
}

// @ts-check

/**
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {boolean} [args.fullname = false] - Return the full path (e.g. "refs/heads/main") instead of the abbreviated form.
 * @param {boolean} [args.test = false] - If the current branch doesn't actually exist (such as right after git init) then return `undefined`.
 *
 * @returns {Promise<string|void>} The name of the current branch or undefined if the HEAD is detached.
 *
 */
async function _currentBranch({
  fs,
  gitdir,
  fullname = false,
  test = false,
}) {
  const ref = await GitRefManager.resolve({
    fs,
    gitdir,
    ref: 'HEAD',
    depth: 2,
  });
  if (test) {
    try {
      await GitRefManager.resolve({ fs, gitdir, ref });
    } catch (_) {
      return
    }
  }
  // Return `undefined` for detached HEAD
  if (!ref.startsWith('refs/')) return
  return fullname ? ref : abbreviateRef(ref)
}

function translateSSHtoHTTP(url) {
  // handle "shorter scp-like syntax"
  url = url.replace(/^git@([^:]+):/, 'https://$1/');
  // handle proper SSH URLs
  url = url.replace(/^ssh:\/\//, 'https://');
  return url
}

function calculateBasicAuthHeader({ username = '', password = '' }) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
}

// Currently 'for await' upsets my linters.
async function forAwait(iterable, cb) {
  const iter = getIterator(iterable);
  while (true) {
    const { value, done } = await iter.next();
    if (value) await cb(value);
    if (done) break
  }
  if (iter.return) iter.return();
}

async function collect(iterable) {
  let size = 0;
  const buffers = [];
  // This will be easier once `for await ... of` loops are available.
  await forAwait(iterable, value => {
    buffers.push(value);
    size += value.byteLength;
  });
  const result = new Uint8Array(size);
  let nextIndex = 0;
  for (const buffer of buffers) {
    result.set(buffer, nextIndex);
    nextIndex += buffer.byteLength;
  }
  return result
}

function extractAuthFromUrl(url) {
  // For whatever reason, the `fetch` API does not convert credentials embedded in the URL
  // into Basic Authentication headers automatically. Instead it throws an error!
  // So we must manually parse the URL, rip out the user:password portion if it is present
  // and compute the Authorization header.
  // Note: I tried using new URL(url) but that throws a security exception in Edge. :rolleyes:
  let userpass = url.match(/^https?:\/\/([^/]+)@/);
  // No credentials, return the url unmodified and an empty auth object
  if (userpass == null) return { url, auth: {} }
  userpass = userpass[1];
  const [username, password] = userpass.split(':');
  // Remove credentials from URL
  url = url.replace(`${userpass}@`, '');
  // Has credentials, return the fetch-safe URL and the parsed credentials
  return { url, auth: { username, password } }
}

function padHex(b, n) {
  const s = n.toString(16);
  return '0'.repeat(b - s.length) + s
}

/**
pkt-line Format
---------------

Much (but not all) of the payload is described around pkt-lines.

A pkt-line is a variable length binary string.  The first four bytes
of the line, the pkt-len, indicates the total length of the line,
in hexadecimal.  The pkt-len includes the 4 bytes used to contain
the length's hexadecimal representation.

A pkt-line MAY contain binary data, so implementors MUST ensure
pkt-line parsing/formatting routines are 8-bit clean.

A non-binary line SHOULD BE terminated by an LF, which if present
MUST be included in the total length. Receivers MUST treat pkt-lines
with non-binary data the same whether or not they contain the trailing
LF (stripping the LF if present, and not complaining when it is
missing).

The maximum length of a pkt-line's data component is 65516 bytes.
Implementations MUST NOT send pkt-line whose length exceeds 65520
(65516 bytes of payload + 4 bytes of length data).

Implementations SHOULD NOT send an empty pkt-line ("0004").

A pkt-line with a length field of 0 ("0000"), called a flush-pkt,
is a special case and MUST be handled differently than an empty
pkt-line ("0004").

----
  pkt-line     =  data-pkt / flush-pkt

  data-pkt     =  pkt-len pkt-payload
  pkt-len      =  4*(HEXDIG)
  pkt-payload  =  (pkt-len - 4)*(OCTET)

  flush-pkt    = "0000"
----

Examples (as C-style strings):

----
  pkt-line          actual value
  ---------------------------------
  "0006a\n"         "a\n"
  "0005a"           "a"
  "000bfoobar\n"    "foobar\n"
  "0004"            ""
----
*/

// I'm really using this more as a namespace.
// There's not a lot of "state" in a pkt-line

class GitPktLine {
  static flush() {
    return Buffer.from('0000', 'utf8')
  }

  static delim() {
    return Buffer.from('0001', 'utf8')
  }

  static encode(line) {
    if (typeof line === 'string') {
      line = Buffer.from(line);
    }
    const length = line.length + 4;
    const hexlength = padHex(4, length);
    return Buffer.concat([Buffer.from(hexlength, 'utf8'), line])
  }

  static streamReader(stream) {
    const reader = new StreamReader(stream);
    return async function read() {
      try {
        let length = await reader.read(4);
        if (length == null) return true
        length = parseInt(length.toString('utf8'), 16);
        if (length === 0) return null
        if (length === 1) return null // delim packets
        const buffer = await reader.read(length - 4);
        if (buffer == null) return true
        return buffer
      } catch (err) {
        console.log('error', err);
        return true
      }
    }
  }
}

// @ts-check

/**
 * @param {function} read
 */
async function parseCapabilitiesV2(read) {
  /** @type {Object<string, string | true>} */
  const capabilities2 = {};

  let line;
  while (true) {
    line = await read();
    if (line === true) break
    if (line === null) continue
    line = line.toString('utf8').replace(/\n$/, '');
    const i = line.indexOf('=');
    if (i > -1) {
      const key = line.slice(0, i);
      const value = line.slice(i + 1);
      capabilities2[key] = value;
    } else {
      capabilities2[line] = true;
    }
  }
  return { protocolVersion: 2, capabilities2 }
}

async function parseRefsAdResponse(stream, { service }) {
  const capabilities = new Set();
  const refs = new Map();
  const symrefs = new Map();

  // There is probably a better way to do this, but for now
  // let's just throw the result parser inline here.
  const read = GitPktLine.streamReader(stream);
  let lineOne = await read();
  // skip past any flushes
  while (lineOne === null) lineOne = await read();

  if (lineOne === true) throw new EmptyServerResponseError()

  // Handle protocol v2 responses (Bitbucket Server doesn't include a `# service=` line)
  if (lineOne.includes('version 2')) {
    return parseCapabilitiesV2(read)
  }

  // Clients MUST ignore an LF at the end of the line.
  if (lineOne.toString('utf8').replace(/\n$/, '') !== `# service=${service}`) {
    throw new ParseError(`# service=${service}\\n`, lineOne.toString('utf8'))
  }
  let lineTwo = await read();
  // skip past any flushes
  while (lineTwo === null) lineTwo = await read();
  // In the edge case of a brand new repo, zero refs (and zero capabilities)
  // are returned.
  if (lineTwo === true) return { capabilities, refs, symrefs }
  lineTwo = lineTwo.toString('utf8');

  // Handle protocol v2 responses
  if (lineTwo.includes('version 2')) {
    return parseCapabilitiesV2(read)
  }

  const [firstRef, capabilitiesLine] = splitAndAssert(lineTwo, '\x00', '\\x00');
  capabilitiesLine.split(' ').map(x => capabilities.add(x));
  const [ref, name] = splitAndAssert(firstRef, ' ', ' ');
  refs.set(name, ref);
  while (true) {
    const line = await read();
    if (line === true) break
    if (line !== null) {
      const [ref, name] = splitAndAssert(line.toString('utf8'), ' ', ' ');
      refs.set(name, ref);
    }
  }
  // Symrefs are thrown into the "capabilities" unfortunately.
  for (const cap of capabilities) {
    if (cap.startsWith('symref=')) {
      const m = cap.match(/symref=([^:]+):(.*)/);
      if (m.length === 3) {
        symrefs.set(m[1], m[2]);
      }
    }
  }
  return { protocolVersion: 1, capabilities, refs, symrefs }
}

function splitAndAssert(line, sep, expected) {
  const split = line.trim().split(sep);
  if (split.length !== 2) {
    throw new ParseError(
      `Two strings separated by '${expected}'`,
      line.toString('utf8')
    )
  }
  return split
}

// Try to accomodate known CORS proxy implementations:
// - https://jcubic.pl/proxy.php?  <-- uses query string
// - https://cors.isomorphic-git.org  <-- uses path
const corsProxify = (corsProxy, url) =>
  corsProxy.endsWith('?')
    ? `${corsProxy}${url}`
    : `${corsProxy}/${url.replace(/^https?:\/\//, '')}`;

const updateHeaders = (headers, auth) => {
  // Update the basic auth header
  if (auth.username || auth.password) {
    headers.Authorization = calculateBasicAuthHeader(auth);
  }
  // but any manually provided headers take precedence
  if (auth.headers) {
    Object.assign(headers, auth.headers);
  }
};

/**
 * @param {GitHttpResponse} res
 *
 * @returns {{ preview: string, response: string, data: Buffer }}
 */
const stringifyBody = async res => {
  try {
    // Some services provide a meaningful error message in the body of 403s like "token lacks the scopes necessary to perform this action"
    const data = Buffer.from(await collect(res.body));
    const response = data.toString('utf8');
    const preview =
      response.length < 256 ? response : response.slice(0, 256) + '...';
    return { preview, response, data }
  } catch (e) {
    return {}
  }
};

class GitRemoteHTTP {
  static async capabilities() {
    return ['discover', 'connect']
  }

  /**
   * @param {Object} args
   * @param {HttpClient} args.http
   * @param {ProgressCallback} [args.onProgress]
   * @param {AuthCallback} [args.onAuth]
   * @param {AuthFailureCallback} [args.onAuthFailure]
   * @param {AuthSuccessCallback} [args.onAuthSuccess]
   * @param {string} [args.corsProxy]
   * @param {string} args.service
   * @param {string} args.url
   * @param {Object<string, string>} args.headers
   * @param {1 | 2} args.protocolVersion - Git Protocol Version
   */
  static async discover({
    http,
    onProgress,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    corsProxy,
    service,
    url: _origUrl,
    headers,
    protocolVersion,
  }) {
    let { url, auth } = extractAuthFromUrl(_origUrl);
    const proxifiedURL = corsProxy ? corsProxify(corsProxy, url) : url;
    if (auth.username || auth.password) {
      headers.Authorization = calculateBasicAuthHeader(auth);
    }
    if (protocolVersion === 2) {
      headers['Git-Protocol'] = 'version=2';
    }

    let res;
    let tryAgain;
    let providedAuthBefore = false;
    do {
      res = await http.request({
        onProgress,
        method: 'GET',
        url: `${proxifiedURL}/info/refs?service=${service}`,
        headers,
      });

      // the default loop behavior
      tryAgain = false;

      // 401 is the "correct" response for access denied. 203 is Non-Authoritative Information and comes from Azure DevOps, which
      // apparently doesn't realize this is a git request and is returning the HTML for the "Azure DevOps Services | Sign In" page.
      if (res.statusCode === 401 || res.statusCode === 203) {
        // On subsequent 401s, call `onAuthFailure` instead of `onAuth`.
        // This is so that naive `onAuth` callbacks that return a fixed value don't create an infinite loop of retrying.
        const getAuth = providedAuthBefore ? onAuthFailure : onAuth;
        if (getAuth) {
          // Acquire credentials and try again
          // TODO: read `useHttpPath` value from git config and pass along?
          auth = await getAuth(url, {
            ...auth,
            headers: { ...headers },
          });
          if (auth && auth.cancel) {
            throw new UserCanceledError()
          } else if (auth) {
            updateHeaders(headers, auth);
            providedAuthBefore = true;
            tryAgain = true;
          }
        }
      } else if (
        res.statusCode === 200 &&
        providedAuthBefore &&
        onAuthSuccess
      ) {
        await onAuthSuccess(url, auth);
      }
    } while (tryAgain)

    if (res.statusCode !== 200) {
      const { response } = await stringifyBody(res);
      throw new HttpError(res.statusCode, res.statusMessage, response)
    }
    // Git "smart" HTTP servers should respond with the correct Content-Type header.
    if (
      res.headers['content-type'] === `application/x-${service}-advertisement`
    ) {
      const remoteHTTP = await parseRefsAdResponse(res.body, { service });
      remoteHTTP.auth = auth;
      return remoteHTTP
    } else {
      // If they don't send the correct content-type header, that's a good indicator it is either a "dumb" HTTP
      // server, or the user specified an incorrect remote URL and the response is actually an HTML page.
      // In this case, we save the response as plain text so we can generate a better error message if needed.
      const { preview, response, data } = await stringifyBody(res);
      // For backwards compatibility, try to parse it anyway.
      // TODO: maybe just throw instead of trying?
      try {
        const remoteHTTP = await parseRefsAdResponse([data], { service });
        remoteHTTP.auth = auth;
        return remoteHTTP
      } catch (e) {
        throw new SmartHttpError(preview, response)
      }
    }
  }

  /**
   * @param {Object} args
   * @param {HttpClient} args.http
   * @param {ProgressCallback} [args.onProgress]
   * @param {string} [args.corsProxy]
   * @param {string} args.service
   * @param {string} args.url
   * @param {Object<string, string>} [args.headers]
   * @param {any} args.body
   * @param {any} args.auth
   */
  static async connect({
    http,
    onProgress,
    corsProxy,
    service,
    url,
    auth,
    body,
    headers,
  }) {
    // We already have the "correct" auth value at this point, but
    // we need to strip out the username/password from the URL yet again.
    const urlAuth = extractAuthFromUrl(url);
    if (urlAuth) url = urlAuth.url;

    if (corsProxy) url = corsProxify(corsProxy, url);

    headers['content-type'] = `application/x-${service}-request`;
    headers.accept = `application/x-${service}-result`;
    updateHeaders(headers, auth);

    const res = await http.request({
      onProgress,
      method: 'POST',
      url: `${url}/${service}`,
      body,
      headers,
    });
    if (res.statusCode !== 200) {
      const { response } = stringifyBody(res);
      throw new HttpError(res.statusCode, res.statusMessage, response)
    }
    return res
  }
}

function parseRemoteUrl({ url }) {
  // the stupid "shorter scp-like syntax"
  if (url.startsWith('git@')) {
    return {
      transport: 'ssh',
      address: url,
    }
  }
  const matches = url.match(/(\w+)(:\/\/|::)(.*)/);
  if (matches === null) return
  /*
   * When git encounters a URL of the form <transport>://<address>, where <transport> is
   * a protocol that it cannot handle natively, it automatically invokes git remote-<transport>
   * with the full URL as the second argument.
   *
   * @see https://git-scm.com/docs/git-remote-helpers
   */
  if (matches[2] === '://') {
    return {
      transport: matches[1],
      address: matches[0],
    }
  }
  /*
   * A URL of the form <transport>::<address> explicitly instructs git to invoke
   * git remote-<transport> with <address> as the second argument.
   *
   * @see https://git-scm.com/docs/git-remote-helpers
   */
  if (matches[2] === '::') {
    return {
      transport: matches[1],
      address: matches[3],
    }
  }
}

class GitRemoteManager {
  static getRemoteHelperFor({ url }) {
    // TODO: clean up the remoteHelper API and move into PluginCore
    const remoteHelpers = new Map();
    remoteHelpers.set('http', GitRemoteHTTP);
    remoteHelpers.set('https', GitRemoteHTTP);

    const parts = parseRemoteUrl({ url });
    if (!parts) {
      throw new UrlParseError(url)
    }
    if (remoteHelpers.has(parts.transport)) {
      return remoteHelpers.get(parts.transport)
    }
    throw new UnknownTransportError(
      url,
      parts.transport,
      parts.transport === 'ssh' ? translateSSHtoHTTP(url) : undefined
    )
  }
}

let lock$1 = null;

class GitShallowManager {
  static async read({ fs, gitdir }) {
    if (lock$1 === null) lock$1 = new AsyncLock();
    const filepath = join(gitdir, 'shallow');
    const oids = new Set();
    await lock$1.acquire(filepath, async function() {
      const text = await fs.read(filepath, { encoding: 'utf8' });
      if (text === null) return oids // no file
      if (text.trim() === '') return oids // empty file
      text
        .trim()
        .split('\n')
        .map(oid => oids.add(oid));
    });
    return oids
  }

  static async write({ fs, gitdir, oids }) {
    if (lock$1 === null) lock$1 = new AsyncLock();
    const filepath = join(gitdir, 'shallow');
    if (oids.size > 0) {
      const text = [...oids].join('\n') + '\n';
      await lock$1.acquire(filepath, async function() {
        await fs.write(filepath, text, {
          encoding: 'utf8',
        });
      });
    } else {
      // No shallows
      await lock$1.acquire(filepath, async function() {
        await fs.rm(filepath);
      });
    }
  }
}

async function hasObjectLoose({ fs, gitdir, oid }) {
  const source = `objects/${oid.slice(0, 2)}/${oid.slice(2)}`;
  return fs.exists(`${gitdir}/${source}`)
}

async function hasObjectPacked({
  fs,
  cache,
  gitdir,
  oid,
  getExternalRefDelta,
}) {
  // Check to see if it's in a packfile.
  // Iterate through all the .idx files
  let list = await fs.readdir(join(gitdir, 'objects/pack'));
  list = list.filter(x => x.endsWith('.idx'));
  for (const filename of list) {
    const indexFile = `${gitdir}/objects/pack/${filename}`;
    const p = await readPackIndex({
      fs,
      cache,
      filename: indexFile,
      getExternalRefDelta,
    });
    if (p.error) throw new InternalError(p.error)
    // If the packfile DOES have the oid we're looking for...
    if (p.offsets.has(oid)) {
      return true
    }
  }
  // Failed to find it
  return false
}

async function hasObject({
  fs,
  cache,
  gitdir,
  oid,
  format = 'content',
}) {
  // Curry the current read method so that the packfile un-deltification
  // process can acquire external ref-deltas.
  const getExternalRefDelta = oid => _readObject({ fs, cache, gitdir, oid });

  // Look for it in the loose object directory.
  let result = await hasObjectLoose({ fs, gitdir, oid });
  // Check to see if it's in a packfile.
  if (!result) {
    result = await hasObjectPacked({
      fs,
      cache,
      gitdir,
      oid,
      getExternalRefDelta,
    });
  }
  // Finally
  return result
}

// TODO: make a function that just returns obCount. then emptyPackfile = () => sizePack(pack) === 0
function emptyPackfile(pack) {
  const pheader = '5041434b';
  const version = '00000002';
  const obCount = '00000000';
  const header = pheader + version + obCount;
  return pack.slice(0, 12).toString('hex') === header
}

function filterCapabilities(server, client) {
  const serverNames = server.map(cap => cap.split('=', 1)[0]);
  return client.filter(cap => {
    const name = cap.split('=', 1)[0];
    return serverNames.includes(name)
  })
}

const pkg = {
  name: 'isomorphic-git',
  version: '1.21.0',
  agent: 'git/isomorphic-git@1.21.0',
};

class FIFO {
  constructor() {
    this._queue = [];
  }

  write(chunk) {
    if (this._ended) {
      throw Error('You cannot write to a FIFO that has already been ended!')
    }
    if (this._waiting) {
      const resolve = this._waiting;
      this._waiting = null;
      resolve({ value: chunk });
    } else {
      this._queue.push(chunk);
    }
  }

  end() {
    this._ended = true;
    if (this._waiting) {
      const resolve = this._waiting;
      this._waiting = null;
      resolve({ done: true });
    }
  }

  destroy(err) {
    this._ended = true;
    this.error = err;
  }

  async next() {
    if (this._queue.length > 0) {
      return { value: this._queue.shift() }
    }
    if (this._ended) {
      return { done: true }
    }
    if (this._waiting) {
      throw Error(
        'You cannot call read until the previous call to read has returned!'
      )
    }
    return new Promise(resolve => {
      this._waiting = resolve;
    })
  }
}

// Note: progress messages are designed to be written directly to the terminal,
// so they are often sent with just a carriage return to overwrite the last line of output.
// But there are also messages delimited with newlines.
// I also include CRLF just in case.
function findSplit(str) {
  const r = str.indexOf('\r');
  const n = str.indexOf('\n');
  if (r === -1 && n === -1) return -1
  if (r === -1) return n + 1 // \n
  if (n === -1) return r + 1 // \r
  if (n === r + 1) return n + 1 // \r\n
  return Math.min(r, n) + 1 // \r or \n
}

function splitLines(input) {
  const output = new FIFO();
  let tmp = ''
  ;(async () => {
    await forAwait(input, chunk => {
      chunk = chunk.toString('utf8');
      tmp += chunk;
      while (true) {
        const i = findSplit(tmp);
        if (i === -1) break
        output.write(tmp.slice(0, i));
        tmp = tmp.slice(i);
      }
    });
    if (tmp.length > 0) {
      output.write(tmp);
    }
    output.end();
  })();
  return output
}

/*
If 'side-band' or 'side-band-64k' capabilities have been specified by
the client, the server will send the packfile data multiplexed.

Each packet starting with the packet-line length of the amount of data
that follows, followed by a single byte specifying the sideband the
following data is coming in on.

In 'side-band' mode, it will send up to 999 data bytes plus 1 control
code, for a total of up to 1000 bytes in a pkt-line.  In 'side-band-64k'
mode it will send up to 65519 data bytes plus 1 control code, for a
total of up to 65520 bytes in a pkt-line.

The sideband byte will be a '1', '2' or a '3'. Sideband '1' will contain
packfile data, sideband '2' will be used for progress information that the
client will generally print to stderr and sideband '3' is used for error
information.

If no 'side-band' capability was specified, the server will stream the
entire packfile without multiplexing.
*/

class GitSideBand {
  static demux(input) {
    const read = GitPktLine.streamReader(input);
    // And now for the ridiculous side-band or side-band-64k protocol
    const packetlines = new FIFO();
    const packfile = new FIFO();
    const progress = new FIFO();
    // TODO: Use a proper through stream?
    const nextBit = async function() {
      const line = await read();
      // Skip over flush packets
      if (line === null) return nextBit()
      // A made up convention to signal there's no more to read.
      if (line === true) {
        packetlines.end();
        progress.end();
        packfile.end();
        return
      }
      // Examine first byte to determine which output "stream" to use
      switch (line[0]) {
        case 1: {
          // pack data
          packfile.write(line.slice(1));
          break
        }
        case 2: {
          // progress message
          progress.write(line.slice(1));
          break
        }
        case 3: {
          // fatal error message just before stream aborts
          const error = line.slice(1);
          progress.write(error);
          packfile.destroy(new Error(error.toString('utf8')));
          return
        }
        default: {
          // Not part of the side-band-64k protocol
          packetlines.write(line.slice(0));
        }
      }
      // Careful not to blow up the stack.
      // I think Promises in a tail-call position should be OK.
      nextBit();
    };
    nextBit();
    return {
      packetlines,
      packfile,
      progress,
    }
  }
  // static mux ({
  //   protocol, // 'side-band' or 'side-band-64k'
  //   packetlines,
  //   packfile,
  //   progress,
  //   error
  // }) {
  //   const MAX_PACKET_LENGTH = protocol === 'side-band-64k' ? 999 : 65519
  //   let output = new PassThrough()
  //   packetlines.on('data', data => {
  //     if (data === null) {
  //       output.write(GitPktLine.flush())
  //     } else {
  //       output.write(GitPktLine.encode(data))
  //     }
  //   })
  //   let packfileWasEmpty = true
  //   let packfileEnded = false
  //   let progressEnded = false
  //   let errorEnded = false
  //   let goodbye = Buffer.concat([
  //     GitPktLine.encode(Buffer.from('010A', 'hex')),
  //     GitPktLine.flush()
  //   ])
  //   packfile
  //     .on('data', data => {
  //       packfileWasEmpty = false
  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
  //       for (const buffer of buffers) {
  //         output.write(
  //           GitPktLine.encode(Buffer.concat([Buffer.from('01', 'hex'), buffer]))
  //         )
  //       }
  //     })
  //     .on('end', () => {
  //       packfileEnded = true
  //       if (!packfileWasEmpty) output.write(goodbye)
  //       if (progressEnded && errorEnded) output.end()
  //     })
  //   progress
  //     .on('data', data => {
  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
  //       for (const buffer of buffers) {
  //         output.write(
  //           GitPktLine.encode(Buffer.concat([Buffer.from('02', 'hex'), buffer]))
  //         )
  //       }
  //     })
  //     .on('end', () => {
  //       progressEnded = true
  //       if (packfileEnded && errorEnded) output.end()
  //     })
  //   error
  //     .on('data', data => {
  //       const buffers = splitBuffer(data, MAX_PACKET_LENGTH)
  //       for (const buffer of buffers) {
  //         output.write(
  //           GitPktLine.encode(Buffer.concat([Buffer.from('03', 'hex'), buffer]))
  //         )
  //       }
  //     })
  //     .on('end', () => {
  //       errorEnded = true
  //       if (progressEnded && packfileEnded) output.end()
  //     })
  //   return output
  // }
}

async function parseUploadPackResponse(stream) {
  const { packetlines, packfile, progress } = GitSideBand.demux(stream);
  const shallows = [];
  const unshallows = [];
  const acks = [];
  let nak = false;
  let done = false;
  return new Promise((resolve, reject) => {
    // Parse the response
    forAwait(packetlines, data => {
      const line = data.toString('utf8').trim();
      if (line.startsWith('shallow')) {
        const oid = line.slice(-41).trim();
        if (oid.length !== 40) {
          reject(new InvalidOidError(oid));
        }
        shallows.push(oid);
      } else if (line.startsWith('unshallow')) {
        const oid = line.slice(-41).trim();
        if (oid.length !== 40) {
          reject(new InvalidOidError(oid));
        }
        unshallows.push(oid);
      } else if (line.startsWith('ACK')) {
        const [, oid, status] = line.split(' ');
        acks.push({ oid, status });
        if (!status) done = true;
      } else if (line.startsWith('NAK')) {
        nak = true;
        done = true;
      }
      if (done) {
        resolve({ shallows, unshallows, acks, nak, packfile, progress });
      }
    });
  })
}

function writeUploadPackRequest({
  capabilities = [],
  wants = [],
  haves = [],
  shallows = [],
  depth = null,
  since = null,
  exclude = [],
}) {
  const packstream = [];
  wants = [...new Set(wants)]; // remove duplicates
  let firstLineCapabilities = ` ${capabilities.join(' ')}`;
  for (const oid of wants) {
    packstream.push(GitPktLine.encode(`want ${oid}${firstLineCapabilities}\n`));
    firstLineCapabilities = '';
  }
  for (const oid of shallows) {
    packstream.push(GitPktLine.encode(`shallow ${oid}\n`));
  }
  if (depth !== null) {
    packstream.push(GitPktLine.encode(`deepen ${depth}\n`));
  }
  if (since !== null) {
    packstream.push(
      GitPktLine.encode(`deepen-since ${Math.floor(since.valueOf() / 1000)}\n`)
    );
  }
  for (const oid of exclude) {
    packstream.push(GitPktLine.encode(`deepen-not ${oid}\n`));
  }
  packstream.push(GitPktLine.flush());
  for (const oid of haves) {
    packstream.push(GitPktLine.encode(`have ${oid}\n`));
  }
  packstream.push(GitPktLine.encode(`done\n`));
  return packstream
}

// @ts-check

/**
 *
 * @typedef {object} FetchResult - The object returned has the following schema:
 * @property {string | null} defaultBranch - The branch that is cloned if no branch is specified
 * @property {string | null} fetchHead - The SHA-1 object id of the fetched head commit
 * @property {string | null} fetchHeadDescription - a textual description of the branch that was fetched
 * @property {Object<string, string>} [headers] - The HTTP response headers returned by the git server
 * @property {string[]} [pruned] - A list of branches that were pruned, if you provided the `prune` parameter
 *
 */

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {HttpClient} args.http
 * @param {ProgressCallback} [args.onProgress]
 * @param {MessageCallback} [args.onMessage]
 * @param {AuthCallback} [args.onAuth]
 * @param {AuthFailureCallback} [args.onAuthFailure]
 * @param {AuthSuccessCallback} [args.onAuthSuccess]
 * @param {string} args.gitdir
 * @param {string|void} [args.url]
 * @param {string} [args.corsProxy]
 * @param {string} [args.ref]
 * @param {string} [args.remoteRef]
 * @param {string} [args.remote]
 * @param {boolean} [args.singleBranch = false]
 * @param {boolean} [args.tags = false]
 * @param {number} [args.depth]
 * @param {Date} [args.since]
 * @param {string[]} [args.exclude = []]
 * @param {boolean} [args.relative = false]
 * @param {Object<string, string>} [args.headers]
 * @param {boolean} [args.prune]
 * @param {boolean} [args.pruneTags]
 *
 * @returns {Promise<FetchResult>}
 * @see FetchResult
 */
async function _fetch({
  fs,
  cache,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  gitdir,
  ref: _ref,
  remoteRef: _remoteRef,
  remote: _remote,
  url: _url,
  corsProxy,
  depth = null,
  since = null,
  exclude = [],
  relative = false,
  tags = false,
  singleBranch = false,
  headers = {},
  prune = false,
  pruneTags = false,
}) {
  const ref = _ref || (await _currentBranch({ fs, gitdir, test: true }));
  const config = await GitConfigManager.get({ fs, gitdir });
  // Figure out what remote to use.
  const remote =
    _remote || (ref && (await config.get(`branch.${ref}.remote`))) || 'origin';
  // Lookup the URL for the given remote.
  const url = _url || (await config.get(`remote.${remote}.url`));
  if (typeof url === 'undefined') {
    throw new MissingParameterError('remote OR url')
  }
  // Figure out what remote ref to use.
  const remoteRef =
    _remoteRef ||
    (ref && (await config.get(`branch.${ref}.merge`))) ||
    _ref ||
    'HEAD';

  if (corsProxy === undefined) {
    corsProxy = await config.get('http.corsProxy');
  }

  const GitRemoteHTTP = GitRemoteManager.getRemoteHelperFor({ url });
  const remoteHTTP = await GitRemoteHTTP.discover({
    http,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    corsProxy,
    service: 'git-upload-pack',
    url,
    headers,
    protocolVersion: 1,
  });
  const auth = remoteHTTP.auth; // hack to get new credentials from CredentialManager API
  const remoteRefs = remoteHTTP.refs;
  // For the special case of an empty repository with no refs, return null.
  if (remoteRefs.size === 0) {
    return {
      defaultBranch: null,
      fetchHead: null,
      fetchHeadDescription: null,
    }
  }
  // Check that the remote supports the requested features
  if (depth !== null && !remoteHTTP.capabilities.has('shallow')) {
    throw new RemoteCapabilityError('shallow', 'depth')
  }
  if (since !== null && !remoteHTTP.capabilities.has('deepen-since')) {
    throw new RemoteCapabilityError('deepen-since', 'since')
  }
  if (exclude.length > 0 && !remoteHTTP.capabilities.has('deepen-not')) {
    throw new RemoteCapabilityError('deepen-not', 'exclude')
  }
  if (relative === true && !remoteHTTP.capabilities.has('deepen-relative')) {
    throw new RemoteCapabilityError('deepen-relative', 'relative')
  }
  // Figure out the SHA for the requested ref
  const { oid, fullref } = GitRefManager.resolveAgainstMap({
    ref: remoteRef,
    map: remoteRefs,
  });
  // Filter out refs we want to ignore: only keep ref we're cloning, HEAD, branches, and tags (if we're keeping them)
  for (const remoteRef of remoteRefs.keys()) {
    if (
      remoteRef === fullref ||
      remoteRef === 'HEAD' ||
      remoteRef.startsWith('refs/heads/') ||
      (tags && remoteRef.startsWith('refs/tags/'))
    ) {
      continue
    }
    remoteRefs.delete(remoteRef);
  }
  // Assemble the application/x-git-upload-pack-request
  const capabilities = filterCapabilities(
    [...remoteHTTP.capabilities],
    [
      'multi_ack_detailed',
      'no-done',
      'side-band-64k',
      // Note: I removed 'thin-pack' option since our code doesn't "fatten" packfiles,
      // which is necessary for compatibility with git. It was the cause of mysterious
      // 'fatal: pack has [x] unresolved deltas' errors that plagued us for some time.
      // isomorphic-git is perfectly happy with thin packfiles in .git/objects/pack but
      // canonical git it turns out is NOT.
      'ofs-delta',
      `agent=${pkg.agent}`,
    ]
  );
  if (relative) capabilities.push('deepen-relative');
  // Start figuring out which oids from the remote we want to request
  const wants = singleBranch ? [oid] : remoteRefs.values();
  // Come up with a reasonable list of oids to tell the remote we already have
  // (preferably oids that are close ancestors of the branch heads we're fetching)
  const haveRefs = singleBranch
    ? [ref]
    : await GitRefManager.listRefs({
        fs,
        gitdir,
        filepath: `refs`,
      });
  let haves = [];
  for (let ref of haveRefs) {
    try {
      ref = await GitRefManager.expand({ fs, gitdir, ref });
      const oid = await GitRefManager.resolve({ fs, gitdir, ref });
      if (await hasObject({ fs, cache, gitdir, oid })) {
        haves.push(oid);
      }
    } catch (err) {}
  }
  haves = [...new Set(haves)];
  const oids = await GitShallowManager.read({ fs, gitdir });
  const shallows = remoteHTTP.capabilities.has('shallow') ? [...oids] : [];
  const packstream = writeUploadPackRequest({
    capabilities,
    wants,
    haves,
    shallows,
    depth,
    since,
    exclude,
  });
  // CodeCommit will hang up if we don't send a Content-Length header
  // so we can't stream the body.
  const packbuffer = Buffer.from(await collect(packstream));
  const raw = await GitRemoteHTTP.connect({
    http,
    onProgress,
    corsProxy,
    service: 'git-upload-pack',
    url,
    auth,
    body: [packbuffer],
    headers,
  });
  const response = await parseUploadPackResponse(raw.body);
  if (raw.headers) {
    response.headers = raw.headers;
  }
  // Apply all the 'shallow' and 'unshallow' commands
  for (const oid of response.shallows) {
    if (!oids.has(oid)) {
      // this is in a try/catch mostly because my old test fixtures are missing objects
      try {
        // server says it's shallow, but do we have the parents?
        const { object } = await _readObject({ fs, cache, gitdir, oid });
        const commit = new GitCommit(object);
        const hasParents = await Promise.all(
          commit
            .headers()
            .parent.map(oid => hasObject({ fs, cache, gitdir, oid }))
        );
        const haveAllParents =
          hasParents.length === 0 || hasParents.every(has => has);
        if (!haveAllParents) {
          oids.add(oid);
        }
      } catch (err) {
        oids.add(oid);
      }
    }
  }
  for (const oid of response.unshallows) {
    oids.delete(oid);
  }
  await GitShallowManager.write({ fs, gitdir, oids });
  // Update local remote refs
  if (singleBranch) {
    const refs = new Map([[fullref, oid]]);
    // But wait, maybe it was a symref, like 'HEAD'!
    // We need to save all the refs in the symref chain (sigh).
    const symrefs = new Map();
    let bail = 10;
    let key = fullref;
    while (bail--) {
      const value = remoteHTTP.symrefs.get(key);
      if (value === undefined) break
      symrefs.set(key, value);
      key = value;
    }
    // final value must not be a symref but a real ref
    const realRef = remoteRefs.get(key);
    // There may be no ref at all if we've fetched a specific commit hash
    if (realRef) {
      refs.set(key, realRef);
    }
    const { pruned } = await GitRefManager.updateRemoteRefs({
      fs,
      gitdir,
      remote,
      refs,
      symrefs,
      tags,
      prune,
    });
    if (prune) {
      response.pruned = pruned;
    }
  } else {
    const { pruned } = await GitRefManager.updateRemoteRefs({
      fs,
      gitdir,
      remote,
      refs: remoteRefs,
      symrefs: remoteHTTP.symrefs,
      tags,
      prune,
      pruneTags,
    });
    if (prune) {
      response.pruned = pruned;
    }
  }
  // We need this value later for the `clone` command.
  response.HEAD = remoteHTTP.symrefs.get('HEAD');
  // AWS CodeCommit doesn't list HEAD as a symref, but we can reverse engineer it
  // Find the SHA of the branch called HEAD
  if (response.HEAD === undefined) {
    const { oid } = GitRefManager.resolveAgainstMap({
      ref: 'HEAD',
      map: remoteRefs,
    });
    // Use the name of the first branch that's not called HEAD that has
    // the same SHA as the branch called HEAD.
    for (const [key, value] of remoteRefs.entries()) {
      if (key !== 'HEAD' && value === oid) {
        response.HEAD = key;
        break
      }
    }
  }
  const noun = fullref.startsWith('refs/tags') ? 'tag' : 'branch';
  response.FETCH_HEAD = {
    oid,
    description: `${noun} '${abbreviateRef(fullref)}' of ${url}`,
  };

  if (onProgress || onMessage) {
    const lines = splitLines(response.progress);
    forAwait(lines, async line => {
      if (onMessage) await onMessage(line);
      if (onProgress) {
        const matches = line.match(/([^:]*).*\((\d+?)\/(\d+?)\)/);
        if (matches) {
          await onProgress({
            phase: matches[1].trim(),
            loaded: parseInt(matches[2], 10),
            total: parseInt(matches[3], 10),
          });
        }
      }
    });
  }
  const packfile = Buffer.from(await collect(response.packfile));
  const packfileSha = packfile.slice(-20).toString('hex');
  const res = {
    defaultBranch: response.HEAD,
    fetchHead: response.FETCH_HEAD.oid,
    fetchHeadDescription: response.FETCH_HEAD.description,
  };
  if (response.headers) {
    res.headers = response.headers;
  }
  if (prune) {
    res.pruned = response.pruned;
  }
  // This is a quick fix for the empty .git/objects/pack/pack-.pack file error,
  // which due to the way `git-list-pack` works causes the program to hang when it tries to read it.
  // TODO: Longer term, we should actually:
  // a) NOT concatenate the entire packfile into memory (line 78),
  // b) compute the SHA of the stream except for the last 20 bytes, using the same library used in push.js, and
  // c) compare the computed SHA with the last 20 bytes of the stream before saving to disk, and throwing a "packfile got corrupted during download" error if the SHA doesn't match.
  if (packfileSha !== '' && !emptyPackfile(packfile)) {
    res.packfile = `objects/pack/pack-${packfileSha}.pack`;
    const fullpath = join(gitdir, res.packfile);
    await fs.write(fullpath, packfile);
    const getExternalRefDelta = oid => _readObject({ fs, cache, gitdir, oid });
    const idx = await GitPackIndex.fromPack({
      pack: packfile,
      getExternalRefDelta,
      onProgress,
    });
    await fs.write(fullpath.replace(/\.pack$/, '.idx'), await idx.toBuffer());
  }
  return res
}

// @ts-check

/**
 * Initialize a new repository
 *
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} [args.dir]
 * @param {string} [args.gitdir]
 * @param {boolean} [args.bare = false]
 * @param {string} [args.defaultBranch = 'master']
 * @returns {Promise<void>}
 */
async function _init({
  fs,
  bare = false,
  dir,
  gitdir = bare ? dir : join(dir, '.git'),
  defaultBranch = 'master',
}) {
  // Don't overwrite an existing config
  if (await fs.exists(gitdir + '/config')) return

  let folders = [
    'hooks',
    'info',
    'objects/info',
    'objects/pack',
    'refs/heads',
    'refs/tags',
  ];
  folders = folders.map(dir => gitdir + '/' + dir);
  for (const folder of folders) {
    await fs.mkdir(folder);
  }

  await fs.write(
    gitdir + '/config',
    '[core]\n' +
      '\trepositoryformatversion = 0\n' +
      '\tfilemode = false\n' +
      `\tbare = ${bare}\n` +
      (bare ? '' : '\tlogallrefupdates = true\n') +
      '\tsymlinks = false\n' +
      '\tignorecase = true\n'
  );
  await fs.write(gitdir + '/HEAD', `ref: refs/heads/${defaultBranch}\n`);
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {HttpClient} args.http
 * @param {ProgressCallback} [args.onProgress]
 * @param {MessageCallback} [args.onMessage]
 * @param {AuthCallback} [args.onAuth]
 * @param {AuthFailureCallback} [args.onAuthFailure]
 * @param {AuthSuccessCallback} [args.onAuthSuccess]
 * @param {string} [args.dir]
 * @param {string} args.gitdir
 * @param {string} args.url
 * @param {string} args.corsProxy
 * @param {string} args.ref
 * @param {boolean} args.singleBranch
 * @param {boolean} args.noCheckout
 * @param {boolean} args.noTags
 * @param {string} args.remote
 * @param {number} args.depth
 * @param {Date} args.since
 * @param {string[]} args.exclude
 * @param {boolean} args.relative
 * @param {Object<string, string>} args.headers
 *
 * @returns {Promise<void>} Resolves successfully when clone completes
 *
 */
async function _clone({
  fs,
  cache,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir,
  url,
  corsProxy,
  ref,
  remote,
  depth,
  since,
  exclude,
  relative,
  singleBranch,
  noCheckout,
  noTags,
  headers,
}) {
  try {
    await _init({ fs, gitdir });
    await _addRemote({ fs, gitdir, remote, url, force: false });
    if (corsProxy) {
      const config = await GitConfigManager.get({ fs, gitdir });
      await config.set(`http.corsProxy`, corsProxy);
      await GitConfigManager.save({ fs, gitdir, config });
    }
    const { defaultBranch, fetchHead } = await _fetch({
      fs,
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      gitdir,
      ref,
      remote,
      corsProxy,
      depth,
      since,
      exclude,
      relative,
      singleBranch,
      headers,
      tags: !noTags,
    });
    if (fetchHead === null) return
    ref = ref || defaultBranch;
    ref = ref.replace('refs/heads/', '');
    // Checkout that branch
    await _checkout({
      fs,
      cache,
      onProgress,
      dir,
      gitdir,
      ref,
      remote,
      noCheckout,
    });
  } catch (err) {
    // Remove partial local repository, see #1283
    // Ignore any error as we are already failing.
    // The catch is necessary so the original error is not masked.
    await fs
      .rmdir(gitdir, { recursive: true, maxRetries: 10 })
      .catch(() => undefined);
    throw err
  }
}

// @ts-check

/**
 * Clone a repository
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {HttpClient} args.http - an HTTP client
 * @param {ProgressCallback} [args.onProgress] - optional progress event callback
 * @param {MessageCallback} [args.onMessage] - optional message event callback
 * @param {AuthCallback} [args.onAuth] - optional auth fill callback
 * @param {AuthFailureCallback} [args.onAuthFailure] - optional auth rejected callback
 * @param {AuthSuccessCallback} [args.onAuthSuccess] - optional auth approved callback
 * @param {string} args.dir - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.url - The URL of the remote repository
 * @param {string} [args.corsProxy] - Optional [CORS proxy](https://www.npmjs.com/%40isomorphic-git/cors-proxy). Value is stored in the git config file for that repo.
 * @param {string} [args.ref] - Which branch to checkout. By default this is the designated "main branch" of the repository.
 * @param {boolean} [args.singleBranch = false] - Instead of the default behavior of fetching all the branches, only fetch a single branch.
 * @param {boolean} [args.noCheckout = false] - If true, clone will only fetch the repo, not check out a branch. Skipping checkout can save a lot of time normally spent writing files to disk.
 * @param {boolean} [args.noTags = false] - By default clone will fetch all tags. `noTags` disables that behavior.
 * @param {string} [args.remote = 'origin'] - What to name the remote that is created.
 * @param {number} [args.depth] - Integer. Determines how much of the git repository's history to retrieve
 * @param {Date} [args.since] - Only fetch commits created after the given date. Mutually exclusive with `depth`.
 * @param {string[]} [args.exclude = []] - A list of branches or tags. Instructs the remote server not to send us any commits reachable from these refs.
 * @param {boolean} [args.relative = false] - Changes the meaning of `depth` to be measured from the current shallow depth rather than from the branch tip.
 * @param {Object<string, string>} [args.headers = {}] - Additional headers to include in HTTP requests, similar to git's `extraHeader` config
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<void>} Resolves successfully when clone completes
 *
 * @example
 * await git.clone({
 *   fs,
 *   http,
 *   dir: '/tutorial',
 *   corsProxy: 'https://cors.isomorphic-git.org',
 *   url: 'https://github.com/isomorphic-git/isomorphic-git',
 *   singleBranch: true,
 *   depth: 1
 * })
 * console.log('done')
 *
 */
async function clone({
  fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, '.git'),
  url,
  corsProxy = undefined,
  ref = undefined,
  remote = 'origin',
  depth = undefined,
  since = undefined,
  exclude = [],
  relative = false,
  singleBranch = false,
  noCheckout = false,
  noTags = false,
  headers = {},
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('http', http);
    assertParameter('gitdir', gitdir);
    if (!noCheckout) {
      assertParameter('dir', dir);
    }
    assertParameter('url', url);

    return await _clone({
      fs: new FileSystem(fs),
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir,
      url,
      corsProxy,
      ref,
      remote,
      depth,
      since,
      exclude,
      relative,
      singleBranch,
      noCheckout,
      noTags,
      headers,
    })
  } catch (err) {
    err.caller = 'git.clone';
    throw err
  }
}

// @ts-check

/**
 * Create a new commit
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {SignCallback} [args.onSign] - a PGP signing implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.message - The commit message to use.
 * @param {Object} [args.author] - The details about the author.
 * @param {string} [args.author.name] - Default is `user.name` config.
 * @param {string} [args.author.email] - Default is `user.email` config.
 * @param {number} [args.author.timestamp=Math.floor(Date.now()/1000)] - Set the author timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.author.timezoneOffset] - Set the author timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {Object} [args.committer = author] - The details about the commit committer, in the same format as the author parameter. If not specified, the author details are used.
 * @param {string} [args.committer.name] - Default is `user.name` config.
 * @param {string} [args.committer.email] - Default is `user.email` config.
 * @param {number} [args.committer.timestamp=Math.floor(Date.now()/1000)] - Set the committer timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.committer.timezoneOffset] - Set the committer timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {string} [args.signingKey] - Sign the tag object using this private PGP key.
 * @param {boolean} [args.dryRun = false] - If true, simulates making a commit so you can test whether it would succeed. Implies `noUpdateBranch`.
 * @param {boolean} [args.noUpdateBranch = false] - If true, does not update the branch pointer after creating the commit.
 * @param {string} [args.ref] - The fully expanded name of the branch to commit to. Default is the current branch pointed to by HEAD. (TODO: fix it so it can expand branch names without throwing if the branch doesn't exist yet.)
 * @param {string[]} [args.parent] - The SHA-1 object ids of the commits to use as parents. If not specified, the commit pointed to by `ref` is used.
 * @param {string} [args.tree] - The SHA-1 object id of the tree to use. If not specified, a new tree object is created from the current git index.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the newly created commit.
 *
 * @example
 * let sha = await git.commit({
 *   fs,
 *   dir: '/tutorial',
 *   author: {
 *     name: 'Mr. Test',
 *     email: 'mrtest@example.com',
 *   },
 *   message: 'Added the a.txt file'
 * })
 * console.log(sha)
 *
 */
async function commit({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, '.git'),
  message,
  author: _author,
  committer: _committer,
  signingKey,
  dryRun = false,
  noUpdateBranch = false,
  ref,
  parent,
  tree,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('message', message);
    if (signingKey) {
      assertParameter('onSign', onSign);
    }
    const fs = new FileSystem(_fs);

    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author) throw new MissingNameError('author')

    const committer = await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer,
    });
    if (!committer) throw new MissingNameError('committer')

    return await _commit({
      fs,
      cache,
      onSign,
      gitdir,
      message,
      author,
      committer,
      signingKey,
      dryRun,
      noUpdateBranch,
      ref,
      parent,
      tree,
    })
  } catch (err) {
    err.caller = 'git.commit';
    throw err
  }
}

// @ts-check

/**
 * Get the name of the branch currently pointed to by .git/HEAD
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {boolean} [args.fullname = false] - Return the full path (e.g. "refs/heads/main") instead of the abbreviated form.
 * @param {boolean} [args.test = false] - If the current branch doesn't actually exist (such as right after git init) then return `undefined`.
 *
 * @returns {Promise<string|void>} The name of the current branch or undefined if the HEAD is detached.
 *
 * @example
 * // Get the current branch name
 * let branch = await git.currentBranch({
 *   fs,
 *   dir: '/tutorial',
 *   fullname: false
 * })
 * console.log(branch)
 *
 */
async function currentBranch({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  fullname = false,
  test = false,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    return await _currentBranch({
      fs: new FileSystem(fs),
      gitdir,
      fullname,
      test,
    })
  } catch (err) {
    err.caller = 'git.currentBranch';
    throw err
  }
}

// @ts-check

/**
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.ref
 *
 * @returns {Promise<void>}
 */
async function _deleteBranch({ fs, gitdir, ref }) {
  const exist = await GitRefManager.exists({ fs, gitdir, ref });
  if (!exist) {
    throw new NotFoundError(ref)
  }

  const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
  const currentRef = await _currentBranch({ fs, gitdir, fullname: true });
  if (fullRef === currentRef) {
    // detach HEAD
    const value = await GitRefManager.resolve({ fs, gitdir, ref: fullRef });
    await GitRefManager.writeRef({ fs, gitdir, ref: 'HEAD', value });
  }

  // Delete a specified branch
  await GitRefManager.deleteRef({ fs, gitdir, ref: fullRef });
}

// @ts-check

/**
 * Delete a local branch
 *
 * > Note: This only deletes loose branches - it should be fixed in the future to delete packed branches as well.
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - The branch to delete
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.deleteBranch({ fs, dir: '/tutorial', ref: 'local-branch' })
 * console.log('done')
 *
 */
async function deleteBranch({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  ref,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('ref', ref);
    return await _deleteBranch({
      fs: new FileSystem(fs),
      gitdir,
      ref,
    })
  } catch (err) {
    err.caller = 'git.deleteBranch';
    throw err
  }
}

// @ts-check

/**
 * Delete a local ref
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - The ref to delete
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.deleteRef({ fs, dir: '/tutorial', ref: 'refs/tags/test-tag' })
 * console.log('done')
 *
 */
async function deleteRef({ fs, dir, gitdir = join(dir, '.git'), ref }) {
  try {
    assertParameter('fs', fs);
    assertParameter('ref', ref);
    await GitRefManager.deleteRef({ fs: new FileSystem(fs), gitdir, ref });
  } catch (err) {
    err.caller = 'git.deleteRef';
    throw err
  }
}

// @ts-check

/**
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.remote
 *
 * @returns {Promise<void>}
 */
async function _deleteRemote({ fs, gitdir, remote }) {
  const config = await GitConfigManager.get({ fs, gitdir });
  await config.deleteSection('remote', remote);
  await GitConfigManager.save({ fs, gitdir, config });
}

// @ts-check

/**
 * Removes the local config entry for a given remote
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.remote - The name of the remote to delete
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.deleteRemote({ fs, dir: '/tutorial', remote: 'upstream' })
 * console.log('done')
 *
 */
async function deleteRemote({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  remote,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('remote', remote);
    return await _deleteRemote({
      fs: new FileSystem(fs),
      gitdir,
      remote,
    })
  } catch (err) {
    err.caller = 'git.deleteRemote';
    throw err
  }
}

// @ts-check

/**
 * Delete a local tag ref
 *
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.ref - The tag to delete
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.deleteTag({ dir: '$input((/))', ref: '$input((test-tag))' })
 * console.log('done')
 *
 */
async function _deleteTag({ fs, gitdir, ref }) {
  ref = ref.startsWith('refs/tags/') ? ref : `refs/tags/${ref}`;
  await GitRefManager.deleteRef({ fs, gitdir, ref });
}

// @ts-check

/**
 * Delete a local tag ref
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - The tag to delete
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.deleteTag({ fs, dir: '/tutorial', ref: 'test-tag' })
 * console.log('done')
 *
 */
async function deleteTag({ fs, dir, gitdir = join(dir, '.git'), ref }) {
  try {
    assertParameter('fs', fs);
    assertParameter('ref', ref);
    return await _deleteTag({
      fs: new FileSystem(fs),
      gitdir,
      ref,
    })
  } catch (err) {
    err.caller = 'git.deleteTag';
    throw err
  }
}

async function expandOidLoose({ fs, gitdir, oid: short }) {
  const prefix = short.slice(0, 2);
  const objectsSuffixes = await fs.readdir(`${gitdir}/objects/${prefix}`);
  return objectsSuffixes
    .map(suffix => `${prefix}${suffix}`)
    .filter(_oid => _oid.startsWith(short))
}

async function expandOidPacked({
  fs,
  cache,
  gitdir,
  oid: short,
  getExternalRefDelta,
}) {
  // Iterate through all the .pack files
  const results = [];
  let list = await fs.readdir(join(gitdir, 'objects/pack'));
  list = list.filter(x => x.endsWith('.idx'));
  for (const filename of list) {
    const indexFile = `${gitdir}/objects/pack/${filename}`;
    const p = await readPackIndex({
      fs,
      cache,
      filename: indexFile,
      getExternalRefDelta,
    });
    if (p.error) throw new InternalError(p.error)
    // Search through the list of oids in the packfile
    for (const oid of p.offsets.keys()) {
      if (oid.startsWith(short)) results.push(oid);
    }
  }
  return results
}

async function _expandOid({ fs, cache, gitdir, oid: short }) {
  // Curry the current read method so that the packfile un-deltification
  // process can acquire external ref-deltas.
  const getExternalRefDelta = oid => _readObject({ fs, cache, gitdir, oid });

  const results1 = await expandOidLoose({ fs, gitdir, oid: short });
  const results2 = await expandOidPacked({
    fs,
    cache,
    gitdir,
    oid: short,
    getExternalRefDelta,
  });
  const results = results1.concat(results2);

  if (results.length === 1) {
    return results[0]
  }
  if (results.length > 1) {
    throw new AmbiguousError('oids', short, results)
  }
  throw new NotFoundError(`an object matching "${short}"`)
}

// @ts-check

/**
 * Expand and resolve a short oid into a full oid
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.oid - The shortened oid prefix to expand (like "0414d2a")
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<string>} Resolves successfully with the full oid (like "0414d2a286d7bbc7a4a326a61c1f9f888a8ab87f")
 *
 * @example
 * let oid = await git.expandOid({ fs, dir: '/tutorial', oid: '0414d2a'})
 * console.log(oid)
 *
 */
async function expandOid({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oid,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);
    return await _expandOid({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid,
    })
  } catch (err) {
    err.caller = 'git.expandOid';
    throw err
  }
}

// @ts-check

/**
 * Expand an abbreviated ref to its full name
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - The ref to expand (like "v1.0.0")
 *
 * @returns {Promise<string>} Resolves successfully with a full ref name ("refs/tags/v1.0.0")
 *
 * @example
 * let fullRef = await git.expandRef({ fs, dir: '/tutorial', ref: 'main'})
 * console.log(fullRef)
 *
 */
async function expandRef({ fs, dir, gitdir = join(dir, '.git'), ref }) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);
    return await GitRefManager.expand({
      fs: new FileSystem(fs),
      gitdir,
      ref,
    })
  } catch (err) {
    err.caller = 'git.expandRef';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string[]} args.oids
 *
 */
async function _findMergeBase({ fs, cache, gitdir, oids }) {
  // Note: right now, the tests are geared so that the output should match that of
  // `git merge-base --all --octopus`
  // because without the --octopus flag, git's output seems to depend on the ORDER of the oids,
  // and computing virtual merge bases is just too much for me to fathom right now.

  // If we start N independent walkers, one at each of the given `oids`, and walk backwards
  // through ancestors, eventually we'll discover a commit where each one of these N walkers
  // has passed through. So we just need to keep track of which walkers have visited each commit
  // until we find a commit that N distinct walkers has visited.
  const visits = {};
  const passes = oids.length;
  let heads = oids.map((oid, index) => ({ index, oid }));
  while (heads.length) {
    // Count how many times we've passed each commit
    const result = new Set();
    for (const { oid, index } of heads) {
      if (!visits[oid]) visits[oid] = new Set();
      visits[oid].add(index);
      if (visits[oid].size === passes) {
        result.add(oid);
      }
    }
    if (result.size > 0) {
      return [...result]
    }
    // We haven't found a common ancestor yet
    const newheads = new Map();
    for (const { oid, index } of heads) {
      try {
        const { object } = await _readObject({ fs, cache, gitdir, oid });
        const commit = GitCommit.from(object);
        const { parent } = commit.parseHeaders();
        for (const oid of parent) {
          if (!visits[oid] || !visits[oid].has(index)) {
            newheads.set(oid + ':' + index, { oid, index });
          }
        }
      } catch (err) {
        // do nothing
      }
    }
    heads = Array.from(newheads.values());
  }
  return []
}

const LINEBREAKS = /^.*(\r?\n|$)/gm;

function mergeFile({ branches, contents }) {
  const ourName = branches[1];
  const theirName = branches[2];

  const baseContent = contents[0];
  const ourContent = contents[1];
  const theirContent = contents[2];

  const ours = ourContent.match(LINEBREAKS);
  const base = baseContent.match(LINEBREAKS);
  const theirs = theirContent.match(LINEBREAKS);

  // Here we let the diff3 library do the heavy lifting.
  const result = diff3Merge(ours, base, theirs);

  const markerSize = 7;

  // Here we note whether there are conflicts and format the results
  let mergedText = '';
  let cleanMerge = true;

  for (const item of result) {
    if (item.ok) {
      mergedText += item.ok.join('');
    }
    if (item.conflict) {
      cleanMerge = false;
      mergedText += `${'<'.repeat(markerSize)} ${ourName}\n`;
      mergedText += item.conflict.a.join('');

      mergedText += `${'='.repeat(markerSize)}\n`;
      mergedText += item.conflict.b.join('');
      mergedText += `${'>'.repeat(markerSize)} ${theirName}\n`;
    }
  }
  return { cleanMerge, mergedText }
}

// @ts-check

/**
 * Create a merged tree
 *
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ourOid - The SHA-1 object id of our tree
 * @param {string} args.baseOid - The SHA-1 object id of the base tree
 * @param {string} args.theirOid - The SHA-1 object id of their tree
 * @param {string} [args.ourName='ours'] - The name to use in conflicted files for our hunks
 * @param {string} [args.baseName='base'] - The name to use in conflicted files (in diff3 format) for the base hunks
 * @param {string} [args.theirName='theirs'] - The name to use in conflicted files for their hunks
 * @param {boolean} [args.dryRun=false]
 * @param {boolean} [args.abortOnConflict=false]
 * @param {MergeDriverCallback} [args.mergeDriver]
 *
 * @returns {Promise<string>} - The SHA-1 object id of the merged tree
 *
 */
async function mergeTree({
  fs,
  cache,
  dir,
  gitdir = join(dir, '.git'),
  ourOid,
  baseOid,
  theirOid,
  ourName = 'ours',
  baseName = 'base',
  theirName = 'theirs',
  dryRun = false,
  abortOnConflict = true,
  mergeDriver,
}) {
  const ourTree = TREE({ ref: ourOid });
  const baseTree = TREE({ ref: baseOid });
  const theirTree = TREE({ ref: theirOid });

  const unmergedFiles = [];

  let cleanMerge = true;

  const results = await _walk({
    fs,
    cache,
    dir,
    gitdir,
    trees: [ourTree, baseTree, theirTree],
    map: async function(filepath, [ours, base, theirs]) {
      const path = basename(filepath);
      // What we did, what they did
      const ourChange = await modified(ours, base);
      const theirChange = await modified(theirs, base);
      switch (`${ourChange}-${theirChange}`) {
        case 'false-false': {
          return {
            mode: await base.mode(),
            path,
            oid: await base.oid(),
            type: await base.type(),
          }
        }
        case 'false-true': {
          return theirs
            ? {
                mode: await theirs.mode(),
                path,
                oid: await theirs.oid(),
                type: await theirs.type(),
              }
            : undefined
        }
        case 'true-false': {
          return ours
            ? {
                mode: await ours.mode(),
                path,
                oid: await ours.oid(),
                type: await ours.type(),
              }
            : undefined
        }
        case 'true-true': {
          // Modifications
          if (
            ours &&
            base &&
            theirs &&
            (await ours.type()) === 'blob' &&
            (await base.type()) === 'blob' &&
            (await theirs.type()) === 'blob'
          ) {
            return mergeBlobs({
              fs,
              gitdir,
              path,
              ours,
              base,
              theirs,
              ourName,
              baseName,
              theirName,
              mergeDriver,
            }).then(r => {
              cleanMerge = cleanMerge && r.cleanMerge;
              unmergedFiles.push(filepath);
              return r.mergeResult
            })
          }
          // all other types of conflicts fail
          throw new MergeNotSupportedError()
        }
      }
    },
    /**
     * @param {TreeEntry} [parent]
     * @param {Array<TreeEntry>} children
     */
    reduce: async (parent, children) => {
      const entries = children.filter(Boolean); // remove undefineds

      // if the parent was deleted, the children have to go
      if (!parent) return

      // automatically delete directories if they have been emptied
      if (parent && parent.type === 'tree' && entries.length === 0) return

      if (entries.length > 0) {
        const tree = new GitTree(entries);
        const object = tree.toObject();
        const oid = await _writeObject({
          fs,
          gitdir,
          type: 'tree',
          object,
          dryRun,
        });
        parent.oid = oid;
      }
      return parent
    },
  });

  if (!cleanMerge) {
    if (dir && !abortOnConflict) {
      await _walk({
        fs,
        cache,
        dir,
        gitdir,
        trees: [TREE({ ref: results.oid })],
        map: async function(filepath, [entry]) {
          const path = `${dir}/${filepath}`;
          if ((await entry.type()) === 'blob') {
            const mode = await entry.mode();
            const content = new TextDecoder().decode(await entry.content());
            await fs.write(path, content, { mode });
          }
          return true
        },
      });
    }
    throw new MergeConflictError(unmergedFiles)
  }

  return results.oid
}

/**
 *
 * @param {WalkerEntry} entry
 * @param {WalkerEntry} base
 *
 */
async function modified(entry, base) {
  if (!entry && !base) return false
  if (entry && !base) return true
  if (!entry && base) return true
  if ((await entry.type()) === 'tree' && (await base.type()) === 'tree') {
    return false
  }
  if (
    (await entry.type()) === (await base.type()) &&
    (await entry.mode()) === (await base.mode()) &&
    (await entry.oid()) === (await base.oid())
  ) {
    return false
  }
  return true
}

/**
 *
 * @param {Object} args
 * @param {import('../models/FileSystem').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.path
 * @param {WalkerEntry} args.ours
 * @param {WalkerEntry} args.base
 * @param {WalkerEntry} args.theirs
 * @param {string} [args.ourName]
 * @param {string} [args.baseName]
 * @param {string} [args.theirName]
 * @param {boolean} [args.dryRun = false]
 * @param {MergeDriverCallback} [args.mergeDriver]
 *
 */
async function mergeBlobs({
  fs,
  gitdir,
  path,
  ours,
  base,
  theirs,
  ourName,
  theirName,
  baseName,
  dryRun,
  mergeDriver = mergeFile,
}) {
  const type = 'blob';
  // Compute the new mode.
  // Since there are ONLY two valid blob modes ('100755' and '100644') it boils down to this
  const mode =
    (await base.mode()) === (await ours.mode())
      ? await theirs.mode()
      : await ours.mode();
  // The trivial case: nothing to merge except maybe mode
  if ((await ours.oid()) === (await theirs.oid())) {
    return {
      cleanMerge: true,
      mergeResult: { mode, path, oid: await ours.oid(), type },
    }
  }
  // if only one side made oid changes, return that side's oid
  if ((await ours.oid()) === (await base.oid())) {
    return {
      cleanMerge: true,
      mergeResult: { mode, path, oid: await theirs.oid(), type },
    }
  }
  if ((await theirs.oid()) === (await base.oid())) {
    return {
      cleanMerge: true,
      mergeResult: { mode, path, oid: await ours.oid(), type },
    }
  }
  // if both sides made changes do a merge
  const ourContent = Buffer.from(await ours.content()).toString('utf8');
  const baseContent = Buffer.from(await base.content()).toString('utf8');
  const theirContent = Buffer.from(await theirs.content()).toString('utf8');
  const { mergedText, cleanMerge } = await mergeDriver({
    branches: [baseName, ourName, theirName],
    contents: [baseContent, ourContent, theirContent],
    path,
  });
  const oid = await _writeObject({
    fs,
    gitdir,
    type: 'blob',
    object: Buffer.from(mergedText, 'utf8'),
    dryRun,
  });

  return { cleanMerge, mergeResult: { mode, path, oid, type } }
}

// @ts-check

// import diff3 from 'node-diff3'
/**
 *
 * @typedef {Object} MergeResult - Returns an object with a schema like this:
 * @property {string} [oid] - The SHA-1 object id that is now at the head of the branch. Absent only if `dryRun` was specified and `mergeCommit` is true.
 * @property {boolean} [alreadyMerged] - True if the branch was already merged so no changes were made
 * @property {boolean} [fastForward] - True if it was a fast-forward merge
 * @property {boolean} [mergeCommit] - True if merge resulted in a merge commit
 * @property {string} [tree] - The SHA-1 object id of the tree resulting from a merge commit
 *
 */

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {string} args.gitdir
 * @param {string} [args.ours]
 * @param {string} args.theirs
 * @param {boolean} args.fastForward
 * @param {boolean} args.fastForwardOnly
 * @param {boolean} args.dryRun
 * @param {boolean} args.noUpdateBranch
 * @param {boolean} args.abortOnConflict
 * @param {string} [args.message]
 * @param {Object} args.author
 * @param {string} args.author.name
 * @param {string} args.author.email
 * @param {number} args.author.timestamp
 * @param {number} args.author.timezoneOffset
 * @param {Object} args.committer
 * @param {string} args.committer.name
 * @param {string} args.committer.email
 * @param {number} args.committer.timestamp
 * @param {number} args.committer.timezoneOffset
 * @param {string} [args.signingKey]
 * @param {SignCallback} [args.onSign] - a PGP signing implementation
 * @param {MergeDriverCallback} [args.mergeDriver]
 *
 * @returns {Promise<MergeResult>} Resolves to a description of the merge operation
 *
 */
async function _merge({
  fs,
  cache,
  dir,
  gitdir,
  ours,
  theirs,
  fastForward = true,
  fastForwardOnly = false,
  dryRun = false,
  noUpdateBranch = false,
  abortOnConflict = true,
  message,
  author,
  committer,
  signingKey,
  onSign,
  mergeDriver,
}) {
  if (ours === undefined) {
    ours = await _currentBranch({ fs, gitdir, fullname: true });
  }
  ours = await GitRefManager.expand({
    fs,
    gitdir,
    ref: ours,
  });
  theirs = await GitRefManager.expand({
    fs,
    gitdir,
    ref: theirs,
  });
  const ourOid = await GitRefManager.resolve({
    fs,
    gitdir,
    ref: ours,
  });
  const theirOid = await GitRefManager.resolve({
    fs,
    gitdir,
    ref: theirs,
  });
  // find most recent common ancestor of ref a and ref b
  const baseOids = await _findMergeBase({
    fs,
    cache,
    gitdir,
    oids: [ourOid, theirOid],
  });
  if (baseOids.length !== 1) {
    throw new MergeNotSupportedError()
  }
  const baseOid = baseOids[0];
  // handle fast-forward case
  if (baseOid === theirOid) {
    return {
      oid: ourOid,
      alreadyMerged: true,
    }
  }
  if (fastForward && baseOid === ourOid) {
    if (!dryRun && !noUpdateBranch) {
      await GitRefManager.writeRef({ fs, gitdir, ref: ours, value: theirOid });
    }
    return {
      oid: theirOid,
      fastForward: true,
    }
  } else {
    // not a simple fast-forward
    if (fastForwardOnly) {
      throw new FastForwardError()
    }
    // try a fancier merge
    const tree = await mergeTree({
      fs,
      cache,
      dir,
      gitdir,
      ourOid,
      theirOid,
      baseOid,
      ourName: abbreviateRef(ours),
      baseName: 'base',
      theirName: abbreviateRef(theirs),
      dryRun,
      abortOnConflict,
      mergeDriver,
    });
    if (!message) {
      message = `Merge branch '${abbreviateRef(theirs)}' into ${abbreviateRef(
        ours
      )}`;
    }
    const oid = await _commit({
      fs,
      cache,
      gitdir,
      message,
      ref: ours,
      tree,
      parent: [ourOid, theirOid],
      author,
      committer,
      signingKey,
      onSign,
      dryRun,
      noUpdateBranch,
    });
    return {
      oid,
      tree,
      mergeCommit: true,
    }
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {HttpClient} args.http
 * @param {ProgressCallback} [args.onProgress]
 * @param {MessageCallback} [args.onMessage]
 * @param {AuthCallback} [args.onAuth]
 * @param {AuthFailureCallback} [args.onAuthFailure]
 * @param {AuthSuccessCallback} [args.onAuthSuccess]
 * @param {string} args.dir
 * @param {string} args.gitdir
 * @param {string} args.ref
 * @param {string} [args.url]
 * @param {string} [args.remote]
 * @param {string} [args.remoteRef]
 * @param {boolean} [args.prune]
 * @param {boolean} [args.pruneTags]
 * @param {string} [args.corsProxy]
 * @param {boolean} args.singleBranch
 * @param {boolean} args.fastForward
 * @param {boolean} args.fastForwardOnly
 * @param {Object<string, string>} [args.headers]
 * @param {Object} args.author
 * @param {string} args.author.name
 * @param {string} args.author.email
 * @param {number} args.author.timestamp
 * @param {number} args.author.timezoneOffset
 * @param {Object} args.committer
 * @param {string} args.committer.name
 * @param {string} args.committer.email
 * @param {number} args.committer.timestamp
 * @param {number} args.committer.timezoneOffset
 * @param {string} [args.signingKey]
 *
 * @returns {Promise<void>} Resolves successfully when pull operation completes
 *
 */
async function _pull({
  fs,
  cache,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir,
  ref,
  url,
  remote,
  remoteRef,
  prune,
  pruneTags,
  fastForward,
  fastForwardOnly,
  corsProxy,
  singleBranch,
  headers,
  author,
  committer,
  signingKey,
}) {
  try {
    // If ref is undefined, use 'HEAD'
    if (!ref) {
      const head = await _currentBranch({ fs, gitdir });
      // TODO: use a better error.
      if (!head) {
        throw new MissingParameterError('ref')
      }
      ref = head;
    }

    const { fetchHead, fetchHeadDescription } = await _fetch({
      fs,
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      gitdir,
      corsProxy,
      ref,
      url,
      remote,
      remoteRef,
      singleBranch,
      headers,
      prune,
      pruneTags,
    });
    // Merge the remote tracking branch into the local one.
    await _merge({
      fs,
      cache,
      gitdir,
      ours: ref,
      theirs: fetchHead,
      fastForward,
      fastForwardOnly,
      message: `Merge ${fetchHeadDescription}`,
      author,
      committer,
      signingKey,
      dryRun: false,
      noUpdateBranch: false,
    });
    await _checkout({
      fs,
      cache,
      onProgress,
      dir,
      gitdir,
      ref,
      remote,
      noCheckout: false,
    });
  } catch (err) {
    err.caller = 'git.pull';
    throw err
  }
}

// @ts-check

/**
 * Like `pull`, but hard-coded with `fastForward: true` so there is no need for an `author` parameter.
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {HttpClient} args.http - an HTTP client
 * @param {ProgressCallback} [args.onProgress] - optional progress event callback
 * @param {MessageCallback} [args.onMessage] - optional message event callback
 * @param {AuthCallback} [args.onAuth] - optional auth fill callback
 * @param {AuthFailureCallback} [args.onAuthFailure] - optional auth rejected callback
 * @param {AuthSuccessCallback} [args.onAuthSuccess] - optional auth approved callback
 * @param {string} args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref] - Which branch to merge into. By default this is the currently checked out branch.
 * @param {string} [args.url] - (Added in 1.1.0) The URL of the remote repository. The default is the value set in the git config for that remote.
 * @param {string} [args.remote] - (Added in 1.1.0) If URL is not specified, determines which remote to use.
 * @param {string} [args.remoteRef] - (Added in 1.1.0) The name of the branch on the remote to fetch. By default this is the configured remote tracking branch.
 * @param {string} [args.corsProxy] - Optional [CORS proxy](https://www.npmjs.com/%40isomorphic-git/cors-proxy). Overrides value in repo config.
 * @param {boolean} [args.singleBranch = false] - Instead of the default behavior of fetching all the branches, only fetch a single branch.
 * @param {Object<string, string>} [args.headers] - Additional headers to include in HTTP requests, similar to git's `extraHeader` config
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<void>} Resolves successfully when pull operation completes
 *
 * @example
 * await git.fastForward({
 *   fs,
 *   http,
 *   dir: '/tutorial',
 *   ref: 'main',
 *   singleBranch: true
 * })
 * console.log('done')
 *
 */
async function fastForward({
  fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  url,
  remote,
  remoteRef,
  corsProxy,
  singleBranch,
  headers = {},
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('http', http);
    assertParameter('gitdir', gitdir);

    const thisWillNotBeUsed = {
      name: '',
      email: '',
      timestamp: Date.now(),
      timezoneOffset: 0,
    };

    return await _pull({
      fs: new FileSystem(fs),
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir,
      ref,
      url,
      remote,
      remoteRef,
      fastForwardOnly: true,
      corsProxy,
      singleBranch,
      headers,
      author: thisWillNotBeUsed,
      committer: thisWillNotBeUsed,
    })
  } catch (err) {
    err.caller = 'git.fastForward';
    throw err
  }
}

// @ts-check

/**
 *
 * @typedef {object} FetchResult - The object returned has the following schema:
 * @property {string | null} defaultBranch - The branch that is cloned if no branch is specified
 * @property {string | null} fetchHead - The SHA-1 object id of the fetched head commit
 * @property {string | null} fetchHeadDescription - a textual description of the branch that was fetched
 * @property {Object<string, string>} [headers] - The HTTP response headers returned by the git server
 * @property {string[]} [pruned] - A list of branches that were pruned, if you provided the `prune` parameter
 *
 */

/**
 * Fetch commits from a remote repository
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {HttpClient} args.http - an HTTP client
 * @param {ProgressCallback} [args.onProgress] - optional progress event callback
 * @param {MessageCallback} [args.onMessage] - optional message event callback
 * @param {AuthCallback} [args.onAuth] - optional auth fill callback
 * @param {AuthFailureCallback} [args.onAuthFailure] - optional auth rejected callback
 * @param {AuthSuccessCallback} [args.onAuthSuccess] - optional auth approved callback
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.url] - The URL of the remote repository. The default is the value set in the git config for that remote.
 * @param {string} [args.remote] - If URL is not specified, determines which remote to use.
 * @param {boolean} [args.singleBranch = false] - Instead of the default behavior of fetching all the branches, only fetch a single branch.
 * @param {string} [args.ref] - Which branch to fetch if `singleBranch` is true. By default this is the current branch or the remote's default branch.
 * @param {string} [args.remoteRef] - The name of the branch on the remote to fetch if `singleBranch` is true. By default this is the configured remote tracking branch.
 * @param {boolean} [args.tags = false] - Also fetch tags
 * @param {number} [args.depth] - Integer. Determines how much of the git repository's history to retrieve
 * @param {boolean} [args.relative = false] - Changes the meaning of `depth` to be measured from the current shallow depth rather than from the branch tip.
 * @param {Date} [args.since] - Only fetch commits created after the given date. Mutually exclusive with `depth`.
 * @param {string[]} [args.exclude = []] - A list of branches or tags. Instructs the remote server not to send us any commits reachable from these refs.
 * @param {boolean} [args.prune = false] - Delete local remote-tracking branches that are not present on the remote
 * @param {boolean} [args.pruneTags = false] - Prune local tags that don’t exist on the remote, and force-update those tags that differ
 * @param {string} [args.corsProxy] - Optional [CORS proxy](https://www.npmjs.com/%40isomorphic-git/cors-proxy). Overrides value in repo config.
 * @param {Object<string, string>} [args.headers] - Additional headers to include in HTTP requests, similar to git's `extraHeader` config
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<FetchResult>} Resolves successfully when fetch completes
 * @see FetchResult
 *
 * @example
 * let result = await git.fetch({
 *   fs,
 *   http,
 *   dir: '/tutorial',
 *   corsProxy: 'https://cors.isomorphic-git.org',
 *   url: 'https://github.com/isomorphic-git/isomorphic-git',
 *   ref: 'main',
 *   depth: 1,
 *   singleBranch: true,
 *   tags: false
 * })
 * console.log(result)
 *
 */
async function fetch({
  fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  remote,
  remoteRef,
  url,
  corsProxy,
  depth = null,
  since = null,
  exclude = [],
  relative = false,
  tags = false,
  singleBranch = false,
  headers = {},
  prune = false,
  pruneTags = false,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('http', http);
    assertParameter('gitdir', gitdir);

    return await _fetch({
      fs: new FileSystem(fs),
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      gitdir,
      ref,
      remote,
      remoteRef,
      url,
      corsProxy,
      depth,
      since,
      exclude,
      relative,
      tags,
      singleBranch,
      headers,
      prune,
      pruneTags,
    })
  } catch (err) {
    err.caller = 'git.fetch';
    throw err
  }
}

// @ts-check

/**
 * Find the merge base for a set of commits
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string[]} args.oids - Which commits
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 */
async function findMergeBase({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oids,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oids', oids);

    return await _findMergeBase({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oids,
    })
  } catch (err) {
    err.caller = 'git.findMergeBase';
    throw err
  }
}

// @ts-check

/**
 * Find the root git directory
 *
 * Starting at `filepath`, walks upward until it finds a directory that contains a subdirectory called '.git'.
 *
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.filepath
 *
 * @returns {Promise<string>} Resolves successfully with a root git directory path
 */
async function _findRoot({ fs, filepath }) {
  if (await fs.exists(join(filepath, '.git'))) {
    return filepath
  } else {
    const parent = dirname(filepath);
    if (parent === filepath) {
      throw new NotFoundError(`git root for ${filepath}`)
    }
    return _findRoot({ fs, filepath: parent })
  }
}

// @ts-check

/**
 * Find the root git directory
 *
 * Starting at `filepath`, walks upward until it finds a directory that contains a subdirectory called '.git'.
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} args.filepath - The file directory to start searching in.
 *
 * @returns {Promise<string>} Resolves successfully with a root git directory path
 * @throws {NotFoundError}
 *
 * @example
 * let gitroot = await git.findRoot({
 *   fs,
 *   filepath: '/tutorial/src/utils'
 * })
 * console.log(gitroot)
 *
 */
async function findRoot({ fs, filepath }) {
  try {
    assertParameter('fs', fs);
    assertParameter('filepath', filepath);

    return await _findRoot({ fs: new FileSystem(fs), filepath })
  } catch (err) {
    err.caller = 'git.findRoot';
    throw err
  }
}

// @ts-check

/**
 * Read an entry from the git config files.
 *
 * *Caveats:*
 * - Currently only the local `$GIT_DIR/config` file can be read or written. However support for the global `~/.gitconfig` and system `$(prefix)/etc/gitconfig` will be added in the future.
 * - The current parser does not support the more exotic features of the git-config file format such as `[include]` and `[includeIf]`.
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.path - The key of the git config entry
 *
 * @returns {Promise<any>} Resolves with the config value
 *
 * @example
 * // Read config value
 * let value = await git.getConfig({
 *   fs,
 *   dir: '/tutorial',
 *   path: 'remote.origin.url'
 * })
 * console.log(value)
 *
 */
async function getConfig({ fs, dir, gitdir = join(dir, '.git'), path }) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('path', path);

    return await _getConfig({
      fs: new FileSystem(fs),
      gitdir,
      path,
    })
  } catch (err) {
    err.caller = 'git.getConfig';
    throw err
  }
}

// @ts-check

/**
 * @param {Object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.path
 *
 * @returns {Promise<Array<any>>} Resolves with an array of the config value
 *
 */
async function _getConfigAll({ fs, gitdir, path }) {
  const config = await GitConfigManager.get({ fs, gitdir });
  return config.getall(path)
}

// @ts-check

/**
 * Read a multi-valued entry from the git config files.
 *
 * *Caveats:*
 * - Currently only the local `$GIT_DIR/config` file can be read or written. However support for the global `~/.gitconfig` and system `$(prefix)/etc/gitconfig` will be added in the future.
 * - The current parser does not support the more exotic features of the git-config file format such as `[include]` and `[includeIf]`.
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.path - The key of the git config entry
 *
 * @returns {Promise<Array<any>>} Resolves with the config value
 *
 */
async function getConfigAll({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  path,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('path', path);

    return await _getConfigAll({
      fs: new FileSystem(fs),
      gitdir,
      path,
    })
  } catch (err) {
    err.caller = 'git.getConfigAll';
    throw err
  }
}

// @ts-check

/**
 *
 * @typedef {Object} GetRemoteInfoResult - The object returned has the following schema:
 * @property {string[]} capabilities - The list of capabilities returned by the server (part of the Git protocol)
 * @property {Object} [refs]
 * @property {string} [HEAD] - The default branch of the remote
 * @property {Object<string, string>} [refs.heads] - The branches on the remote
 * @property {Object<string, string>} [refs.pull] - The special branches representing pull requests (non-standard)
 * @property {Object<string, string>} [refs.tags] - The tags on the remote
 *
 */

/**
 * List a remote servers branches, tags, and capabilities.
 *
 * This is a rare command that doesn't require an `fs`, `dir`, or even `gitdir` argument.
 * It just communicates to a remote git server, using the first step of the `git-upload-pack` handshake, but stopping short of fetching the packfile.
 *
 * @param {object} args
 * @param {HttpClient} args.http - an HTTP client
 * @param {AuthCallback} [args.onAuth] - optional auth fill callback
 * @param {AuthFailureCallback} [args.onAuthFailure] - optional auth rejected callback
 * @param {AuthSuccessCallback} [args.onAuthSuccess] - optional auth approved callback
 * @param {string} args.url - The URL of the remote repository. Will be gotten from gitconfig if absent.
 * @param {string} [args.corsProxy] - Optional [CORS proxy](https://www.npmjs.com/%40isomorphic-git/cors-proxy). Overrides value in repo config.
 * @param {boolean} [args.forPush = false] - By default, the command queries the 'fetch' capabilities. If true, it will ask for the 'push' capabilities.
 * @param {Object<string, string>} [args.headers] - Additional headers to include in HTTP requests, similar to git's `extraHeader` config
 *
 * @returns {Promise<GetRemoteInfoResult>} Resolves successfully with an object listing the branches, tags, and capabilities of the remote.
 * @see GetRemoteInfoResult
 *
 * @example
 * let info = await git.getRemoteInfo({
 *   http,
 *   url:
 *     "https://cors.isomorphic-git.org/github.com/isomorphic-git/isomorphic-git.git"
 * });
 * console.log(info);
 *
 */
async function getRemoteInfo({
  http,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  corsProxy,
  url,
  headers = {},
  forPush = false,
}) {
  try {
    assertParameter('http', http);
    assertParameter('url', url);

    const GitRemoteHTTP = GitRemoteManager.getRemoteHelperFor({ url });
    const remote = await GitRemoteHTTP.discover({
      http,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service: forPush ? 'git-receive-pack' : 'git-upload-pack',
      url,
      headers,
      protocolVersion: 1,
    });

    // Note: remote.capabilities, remote.refs, and remote.symrefs are Set and Map objects,
    // but one of the objectives of the public API is to always return JSON-compatible objects
    // so we must JSONify them.
    const result = {
      capabilities: [...remote.capabilities],
    };
    // Convert the flat list into an object tree, because I figure 99% of the time
    // that will be easier to use.
    for (const [ref, oid] of remote.refs) {
      const parts = ref.split('/');
      const last = parts.pop();
      let o = result;
      for (const part of parts) {
        o[part] = o[part] || {};
        o = o[part];
      }
      o[last] = oid;
    }
    // Merge symrefs on top of refs to more closely match actual git repo layouts
    for (const [symref, ref] of remote.symrefs) {
      const parts = symref.split('/');
      const last = parts.pop();
      let o = result;
      for (const part of parts) {
        o[part] = o[part] || {};
        o = o[part];
      }
      o[last] = ref;
    }
    return result
  } catch (err) {
    err.caller = 'git.getRemoteInfo';
    throw err
  }
}

// @ts-check

/**
 * @param {any} remote
 * @param {string} prefix
 * @param {boolean} symrefs
 * @param {boolean} peelTags
 * @returns {ServerRef[]}
 */
function formatInfoRefs(remote, prefix, symrefs, peelTags) {
  const refs = [];
  for (const [key, value] of remote.refs) {
    if (prefix && !key.startsWith(prefix)) continue

    if (key.endsWith('^{}')) {
      if (peelTags) {
        const _key = key.replace('^{}', '');
        // Peeled tags are almost always listed immediately after the original tag
        const last = refs[refs.length - 1];
        const r = last.ref === _key ? last : refs.find(x => x.ref === _key);
        if (r === undefined) {
          throw new Error('I did not expect this to happen')
        }
        r.peeled = value;
      }
      continue
    }
    /** @type ServerRef */
    const ref = { ref: key, oid: value };
    if (symrefs) {
      if (remote.symrefs.has(key)) {
        ref.target = remote.symrefs.get(key);
      }
    }
    refs.push(ref);
  }
  return refs
}

// @ts-check

/**
 * @typedef {Object} GetRemoteInfo2Result - This object has the following schema:
 * @property {1 | 2} protocolVersion - Git protocol version the server supports
 * @property {Object<string, string | true>} capabilities - An object of capabilities represented as keys and values
 * @property {ServerRef[]} [refs] - Server refs (they get returned by protocol version 1 whether you want them or not)
 */

/**
 * List a remote server's capabilities.
 *
 * This is a rare command that doesn't require an `fs`, `dir`, or even `gitdir` argument.
 * It just communicates to a remote git server, determining what protocol version, commands, and features it supports.
 *
 * > The successor to [`getRemoteInfo`](./getRemoteInfo.md), this command supports Git Wire Protocol Version 2.
 * > Therefore its return type is more complicated as either:
 * >
 * > - v1 capabilities (and refs) or
 * > - v2 capabilities (and no refs)
 * >
 * > are returned.
 * > If you just care about refs, use [`listServerRefs`](./listServerRefs.md)
 *
 * @param {object} args
 * @param {HttpClient} args.http - an HTTP client
 * @param {AuthCallback} [args.onAuth] - optional auth fill callback
 * @param {AuthFailureCallback} [args.onAuthFailure] - optional auth rejected callback
 * @param {AuthSuccessCallback} [args.onAuthSuccess] - optional auth approved callback
 * @param {string} args.url - The URL of the remote repository. Will be gotten from gitconfig if absent.
 * @param {string} [args.corsProxy] - Optional [CORS proxy](https://www.npmjs.com/%40isomorphic-git/cors-proxy). Overrides value in repo config.
 * @param {boolean} [args.forPush = false] - By default, the command queries the 'fetch' capabilities. If true, it will ask for the 'push' capabilities.
 * @param {Object<string, string>} [args.headers] - Additional headers to include in HTTP requests, similar to git's `extraHeader` config
 * @param {1 | 2} [args.protocolVersion = 2] - Which version of the Git Protocol to use.
 *
 * @returns {Promise<GetRemoteInfo2Result>} Resolves successfully with an object listing the capabilities of the remote.
 * @see GetRemoteInfo2Result
 * @see ServerRef
 *
 * @example
 * let info = await git.getRemoteInfo2({
 *   http,
 *   corsProxy: "https://cors.isomorphic-git.org",
 *   url: "https://github.com/isomorphic-git/isomorphic-git.git"
 * });
 * console.log(info);
 *
 */
async function getRemoteInfo2({
  http,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  corsProxy,
  url,
  headers = {},
  forPush = false,
  protocolVersion = 2,
}) {
  try {
    assertParameter('http', http);
    assertParameter('url', url);

    const GitRemoteHTTP = GitRemoteManager.getRemoteHelperFor({ url });
    const remote = await GitRemoteHTTP.discover({
      http,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service: forPush ? 'git-receive-pack' : 'git-upload-pack',
      url,
      headers,
      protocolVersion,
    });

    if (remote.protocolVersion === 2) {
      /** @type GetRemoteInfo2Result */
      return {
        protocolVersion: remote.protocolVersion,
        capabilities: remote.capabilities2,
      }
    }

    // Note: remote.capabilities, remote.refs, and remote.symrefs are Set and Map objects,
    // but one of the objectives of the public API is to always return JSON-compatible objects
    // so we must JSONify them.
    /** @type Object<string, true> */
    const capabilities = {};
    for (const cap of remote.capabilities) {
      const [key, value] = cap.split('=');
      if (value) {
        capabilities[key] = value;
      } else {
        capabilities[key] = true;
      }
    }
    /** @type GetRemoteInfo2Result */
    return {
      protocolVersion: 1,
      capabilities,
      refs: formatInfoRefs(remote, undefined, true, true),
    }
  } catch (err) {
    err.caller = 'git.getRemoteInfo2';
    throw err
  }
}

async function hashObject({
  type,
  object,
  format = 'content',
  oid = undefined,
}) {
  if (format !== 'deflated') {
    if (format !== 'wrapped') {
      object = GitObject.wrap({ type, object });
    }
    oid = await shasum(object);
  }
  return { oid, object }
}

// @ts-check

/**
 *
 * @typedef {object} HashBlobResult - The object returned has the following schema:
 * @property {string} oid - The SHA-1 object id
 * @property {'blob'} type - The type of the object
 * @property {Uint8Array} object - The wrapped git object (the thing that is hashed)
 * @property {'wrapped'} format - The format of the object
 *
 */

/**
 * Compute what the SHA-1 object id of a file would be
 *
 * @param {object} args
 * @param {Uint8Array|string} args.object - The object to write. If `object` is a String then it will be converted to a Uint8Array using UTF-8 encoding.
 *
 * @returns {Promise<HashBlobResult>} Resolves successfully with the SHA-1 object id and the wrapped object Uint8Array.
 * @see HashBlobResult
 *
 * @example
 * let { oid, type, object, format } = await git.hashBlob({
 *   object: 'Hello world!',
 * })
 *
 * console.log('oid', oid)
 * console.log('type', type)
 * console.log('object', object)
 * console.log('format', format)
 *
 */
async function hashBlob({ object }) {
  try {
    assertParameter('object', object);

    // Convert object to buffer
    if (typeof object === 'string') {
      object = Buffer.from(object, 'utf8');
    } else {
      object = Buffer.from(object);
    }

    const type = 'blob';
    const { oid, object: _object } = await hashObject({
      type: 'blob',
      format: 'content',
      object,
    });
    return { oid, type, object: new Uint8Array(_object), format: 'wrapped' }
  } catch (err) {
    err.caller = 'git.hashBlob';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {ProgressCallback} [args.onProgress]
 * @param {string} args.dir
 * @param {string} args.gitdir
 * @param {string} args.filepath
 *
 * @returns {Promise<{oids: string[]}>}
 */
async function _indexPack({
  fs,
  cache,
  onProgress,
  dir,
  gitdir,
  filepath,
}) {
  try {
    filepath = join(dir, filepath);
    const pack = await fs.read(filepath);
    const getExternalRefDelta = oid => _readObject({ fs, cache, gitdir, oid });
    const idx = await GitPackIndex.fromPack({
      pack,
      getExternalRefDelta,
      onProgress,
    });
    await fs.write(filepath.replace(/\.pack$/, '.idx'), await idx.toBuffer());
    return {
      oids: [...idx.hashes],
    }
  } catch (err) {
    err.caller = 'git.indexPack';
    throw err
  }
}

// @ts-check

/**
 * Create the .idx file for a given .pack file
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {ProgressCallback} [args.onProgress] - optional progress event callback
 * @param {string} args.dir - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.filepath - The path to the .pack file to index
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<{oids: string[]}>} Resolves with a list of the SHA-1 object ids contained in the packfile
 *
 * @example
 * let packfiles = await fs.promises.readdir('/tutorial/.git/objects/pack')
 * packfiles = packfiles.filter(name => name.endsWith('.pack'))
 * console.log('packfiles', packfiles)
 *
 * const { oids } = await git.indexPack({
 *   fs,
 *   dir: '/tutorial',
 *   filepath: `.git/objects/pack/${packfiles[0]}`,
 *   async onProgress (evt) {
 *     console.log(`${evt.phase}: ${evt.loaded} / ${evt.total}`)
 *   }
 * })
 * console.log(oids)
 *
 */
async function indexPack({
  fs,
  onProgress,
  dir,
  gitdir = join(dir, '.git'),
  filepath,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('dir', dir);
    assertParameter('gitdir', dir);
    assertParameter('filepath', filepath);

    return await _indexPack({
      fs: new FileSystem(fs),
      cache,
      onProgress,
      dir,
      gitdir,
      filepath,
    })
  } catch (err) {
    err.caller = 'git.indexPack';
    throw err
  }
}

// @ts-check

/**
 * Initialize a new repository
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {boolean} [args.bare = false] - Initialize a bare repository
 * @param {string} [args.defaultBranch = 'master'] - The name of the default branch (might be changed to a required argument in 2.0.0)
 * @returns {Promise<void>}  Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.init({ fs, dir: '/tutorial' })
 * console.log('done')
 *
 */
async function init({
  fs,
  bare = false,
  dir,
  gitdir = bare ? dir : join(dir, '.git'),
  defaultBranch = 'master',
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    if (!bare) {
      assertParameter('dir', dir);
    }

    return await _init({
      fs: new FileSystem(fs),
      bare,
      dir,
      gitdir,
      defaultBranch,
    })
  } catch (err) {
    err.caller = 'git.init';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} args.oid
 * @param {string} args.ancestor
 * @param {number} args.depth - Maximum depth to search before giving up. -1 means no maximum depth.
 *
 * @returns {Promise<boolean>}
 */
async function _isDescendent({
  fs,
  cache,
  gitdir,
  oid,
  ancestor,
  depth,
}) {
  const shallows = await GitShallowManager.read({ fs, gitdir });
  if (!oid) {
    throw new MissingParameterError('oid')
  }
  if (!ancestor) {
    throw new MissingParameterError('ancestor')
  }
  // If you don't like this behavior, add your own check.
  // Edge cases are hard to define a perfect solution.
  if (oid === ancestor) return false
  // We do not use recursion here, because that would lead to depth-first traversal,
  // and we want to maintain a breadth-first traversal to avoid hitting shallow clone depth cutoffs.
  const queue = [oid];
  const visited = new Set();
  let searchdepth = 0;
  while (queue.length) {
    if (searchdepth++ === depth) {
      throw new MaxDepthError(depth)
    }
    const oid = queue.shift();
    const { type, object } = await _readObject({
      fs,
      cache,
      gitdir,
      oid,
    });
    if (type !== 'commit') {
      throw new ObjectTypeError(oid, type, 'commit')
    }
    const commit = GitCommit.from(object).parse();
    // Are any of the parents the sought-after ancestor?
    for (const parent of commit.parent) {
      if (parent === ancestor) return true
    }
    // If not, add them to heads (unless we know this is a shallow commit)
    if (!shallows.has(oid)) {
      for (const parent of commit.parent) {
        if (!visited.has(parent)) {
          queue.push(parent);
          visited.add(parent);
        }
      }
    }
    // Eventually, we'll travel entire tree to the roots where all the parents are empty arrays,
    // or hit the shallow depth and throw an error. Excluding the possibility of grafts, or
    // different branches cloned to different depths, you would hit this error at the same time
    // for all parents, so trying to continue is futile.
  }
  return false
}

// @ts-check

/**
 * Check whether a git commit is descended from another
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.oid - The descendent commit
 * @param {string} args.ancestor - The (proposed) ancestor commit
 * @param {number} [args.depth = -1] - Maximum depth to search before giving up. -1 means no maximum depth.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<boolean>} Resolves to true if `oid` is a descendent of `ancestor`
 *
 * @example
 * let oid = await git.resolveRef({ fs, dir: '/tutorial', ref: 'main' })
 * let ancestor = await git.resolveRef({ fs, dir: '/tutorial', ref: 'v0.20.0' })
 * console.log(oid, ancestor)
 * await git.isDescendent({ fs, dir: '/tutorial', oid, ancestor, depth: -1 })
 *
 */
async function isDescendent({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oid,
  ancestor,
  depth = -1,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);
    assertParameter('ancestor', ancestor);

    return await _isDescendent({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid,
      ancestor,
      depth,
    })
  } catch (err) {
    err.caller = 'git.isDescendent';
    throw err
  }
}

// @ts-check

/**
 * Test whether a filepath should be ignored (because of .gitignore or .git/exclude)
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} args.dir - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.filepath - The filepath to test
 *
 * @returns {Promise<boolean>} Resolves to true if the file should be ignored
 *
 * @example
 * await git.isIgnored({ fs, dir: '/tutorial', filepath: 'docs/add.md' })
 *
 */
async function isIgnored({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  filepath,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('dir', dir);
    assertParameter('gitdir', gitdir);
    assertParameter('filepath', filepath);

    return GitIgnoreManager.isIgnored({
      fs: new FileSystem(fs),
      dir,
      gitdir,
      filepath,
    })
  } catch (err) {
    err.caller = 'git.isIgnored';
    throw err
  }
}

// @ts-check

/**
 * List branches
 *
 * By default it lists local branches. If a 'remote' is specified, it lists the remote's branches. When listing remote branches, the HEAD branch is not filtered out, so it may be included in the list of results.
 *
 * Note that specifying a remote does not actually contact the server and update the list of branches.
 * If you want an up-to-date list, first do a `fetch` to that remote.
 * (Which branch you fetch doesn't matter - the list of branches available on the remote is updated during the fetch handshake.)
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.remote] - Instead of the branches in `refs/heads`, list the branches in `refs/remotes/${remote}`.
 *
 * @returns {Promise<Array<string>>} Resolves successfully with an array of branch names
 *
 * @example
 * let branches = await git.listBranches({ fs, dir: '/tutorial' })
 * console.log(branches)
 * let remoteBranches = await git.listBranches({ fs, dir: '/tutorial', remote: 'origin' })
 * console.log(remoteBranches)
 *
 */
async function listBranches({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  remote,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);

    return GitRefManager.listBranches({
      fs: new FileSystem(fs),
      gitdir,
      remote,
    })
  } catch (err) {
    err.caller = 'git.listBranches';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {string} args.gitdir
 * @param {string} [args.ref]
 *
 * @returns {Promise<Array<string>>}
 */
async function _listFiles({ fs, gitdir, ref, cache }) {
  if (ref) {
    const oid = await GitRefManager.resolve({ gitdir, fs, ref });
    const filenames = [];
    await accumulateFilesFromOid({
      fs,
      cache,
      gitdir,
      oid,
      filenames,
      prefix: '',
    });
    return filenames
  } else {
    return GitIndexManager.acquire({ fs, gitdir, cache }, async function(
      index
    ) {
      return index.entries.map(x => x.path)
    })
  }
}

async function accumulateFilesFromOid({
  fs,
  cache,
  gitdir,
  oid,
  filenames,
  prefix,
}) {
  const { tree } = await _readTree({ fs, cache, gitdir, oid });
  // TODO: Use `walk` to do this. Should be faster.
  for (const entry of tree) {
    if (entry.type === 'tree') {
      await accumulateFilesFromOid({
        fs,
        cache,
        gitdir,
        oid: entry.oid,
        filenames,
        prefix: join(prefix, entry.path),
      });
    } else {
      filenames.push(join(prefix, entry.path));
    }
  }
}

// @ts-check

/**
 * List all the files in the git index or a commit
 *
 * > Note: This function is efficient for listing the files in the staging area, but listing all the files in a commit requires recursively walking through the git object store.
 * > If you do not require a complete list of every file, better performance can be achieved by using [walk](./walk) and ignoring subdirectories you don't care about.
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref] - Return a list of all the files in the commit at `ref` instead of the files currently in the git index (aka staging area)
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<Array<string>>} Resolves successfully with an array of filepaths
 *
 * @example
 * // All the files in the previous commit
 * let files = await git.listFiles({ fs, dir: '/tutorial', ref: 'HEAD' })
 * console.log(files)
 * // All the files in the current staging area
 * files = await git.listFiles({ fs, dir: '/tutorial' })
 * console.log(files)
 *
 */
async function listFiles({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);

    return await _listFiles({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      ref,
    })
  } catch (err) {
    err.caller = 'git.listFiles';
    throw err
  }
}

// @ts-check

/**
 * List all the object notes
 *
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} args.ref
 *
 * @returns {Promise<Array<{target: string, note: string}>>}
 */

async function _listNotes({ fs, cache, gitdir, ref }) {
  // Get the current note commit
  let parent;
  try {
    parent = await GitRefManager.resolve({ gitdir, fs, ref });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return []
    }
  }

  // Create the current note tree
  const result = await _readTree({
    fs,
    cache,
    gitdir,
    oid: parent,
  });

  // Format the tree entries
  const notes = result.tree.map(entry => ({
    target: entry.path,
    note: entry.oid,
  }));
  return notes
}

// @ts-check

/**
 * List all the object notes
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref] - The notes ref to look under
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<Array<{target: string, note: string}>>} Resolves successfully with an array of entries containing SHA-1 object ids of the note and the object the note targets
 */

async function listNotes({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  ref = 'refs/notes/commits',
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);

    return await _listNotes({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      ref,
    })
  } catch (err) {
    err.caller = 'git.listNotes';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 *
 * @returns {Promise<Array<{remote: string, url: string}>>}
 */
async function _listRemotes({ fs, gitdir }) {
  const config = await GitConfigManager.get({ fs, gitdir });
  const remoteNames = await config.getSubsections('remote');
  const remotes = Promise.all(
    remoteNames.map(async remote => {
      const url = await config.get(`remote.${remote}.url`);
      return { remote, url }
    })
  );
  return remotes
}

// @ts-check

/**
 * List remotes
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 *
 * @returns {Promise<Array<{remote: string, url: string}>>} Resolves successfully with an array of `{remote, url}` objects
 *
 * @example
 * let remotes = await git.listRemotes({ fs, dir: '/tutorial' })
 * console.log(remotes)
 *
 */
async function listRemotes({ fs, dir, gitdir = join(dir, '.git') }) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);

    return await _listRemotes({
      fs: new FileSystem(fs),
      gitdir,
    })
  } catch (err) {
    err.caller = 'git.listRemotes';
    throw err
  }
}

/**
 * @typedef {Object} ServerRef - This object has the following schema:
 * @property {string} ref - The name of the ref
 * @property {string} oid - The SHA-1 object id the ref points to
 * @property {string} [target] - The target ref pointed to by a symbolic ref
 * @property {string} [peeled] - If the oid is the SHA-1 object id of an annotated tag, this is the SHA-1 object id that the annotated tag points to
 */

async function parseListRefsResponse(stream) {
  const read = GitPktLine.streamReader(stream);

  // TODO: when we re-write everything to minimize memory usage,
  // we could make this a generator
  const refs = [];

  let line;
  while (true) {
    line = await read();
    if (line === true) break
    if (line === null) continue
    line = line.toString('utf8').replace(/\n$/, '');
    const [oid, ref, ...attrs] = line.split(' ');
    const r = { ref, oid };
    for (const attr of attrs) {
      const [name, value] = attr.split(':');
      if (name === 'symref-target') {
        r.target = value;
      } else if (name === 'peeled') {
        r.peeled = value;
      }
    }
    refs.push(r);
  }

  return refs
}

/**
 * @param {object} args
 * @param {string} [args.prefix] - Only list refs that start with this prefix
 * @param {boolean} [args.symrefs = false] - Include symbolic ref targets
 * @param {boolean} [args.peelTags = false] - Include peeled tags values
 * @returns {Uint8Array[]}
 */
async function writeListRefsRequest({ prefix, symrefs, peelTags }) {
  const packstream = [];
  // command
  packstream.push(GitPktLine.encode('command=ls-refs\n'));
  // capability-list
  packstream.push(GitPktLine.encode(`agent=${pkg.agent}\n`));
  // [command-args]
  if (peelTags || symrefs || prefix) {
    packstream.push(GitPktLine.delim());
  }
  if (peelTags) packstream.push(GitPktLine.encode('peel'));
  if (symrefs) packstream.push(GitPktLine.encode('symrefs'));
  if (prefix) packstream.push(GitPktLine.encode(`ref-prefix ${prefix}`));
  packstream.push(GitPktLine.flush());
  return packstream
}

// @ts-check

/**
 * Fetch a list of refs (branches, tags, etc) from a server.
 *
 * This is a rare command that doesn't require an `fs`, `dir`, or even `gitdir` argument.
 * It just requires an `http` argument.
 *
 * ### About `protocolVersion`
 *
 * There's a rather fun trade-off between Git Protocol Version 1 and Git Protocol Version 2.
 * Version 2 actually requires 2 HTTP requests instead of 1, making it similar to fetch or push in that regard.
 * However, version 2 supports server-side filtering by prefix, whereas that filtering is done client-side in version 1.
 * Which protocol is most efficient therefore depends on the number of refs on the remote, the latency of the server, and speed of the network connection.
 * For an small repos (or fast Internet connections), the requirement to make two trips to the server makes protocol 2 slower.
 * But for large repos (or slow Internet connections), the decreased payload size of the second request makes up for the additional request.
 *
 * Hard numbers vary by situation, but here's some numbers from my machine:
 *
 * Using isomorphic-git in a browser, with a CORS proxy, listing only the branches (refs/heads) of https://github.com/isomorphic-git/isomorphic-git
 * - Protocol Version 1 took ~300ms and transfered 84 KB.
 * - Protocol Version 2 took ~500ms and transfered 4.1 KB.
 *
 * Using isomorphic-git in a browser, with a CORS proxy, listing only the branches (refs/heads) of https://gitlab.com/gitlab-org/gitlab
 * - Protocol Version 1 took ~4900ms and transfered 9.41 MB.
 * - Protocol Version 2 took ~1280ms and transfered 433 KB.
 *
 * Finally, there is a fun quirk regarding the `symrefs` parameter.
 * Protocol Version 1 will generally only return the `HEAD` symref and not others.
 * Historically, this meant that servers don't use symbolic refs except for `HEAD`, which is used to point at the "default branch".
 * However Protocol Version 2 can return *all* the symbolic refs on the server.
 * So if you are running your own git server, you could take advantage of that I guess.
 *
 * #### TL;DR
 * If you are _not_ taking advantage of `prefix` I would recommend `protocolVersion: 1`.
 * Otherwise, I recommend to use the default which is `protocolVersion: 2`.
 *
 * @param {object} args
 * @param {HttpClient} args.http - an HTTP client
 * @param {AuthCallback} [args.onAuth] - optional auth fill callback
 * @param {AuthFailureCallback} [args.onAuthFailure] - optional auth rejected callback
 * @param {AuthSuccessCallback} [args.onAuthSuccess] - optional auth approved callback
 * @param {string} args.url - The URL of the remote repository. Will be gotten from gitconfig if absent.
 * @param {string} [args.corsProxy] - Optional [CORS proxy](https://www.npmjs.com/%40isomorphic-git/cors-proxy). Overrides value in repo config.
 * @param {boolean} [args.forPush = false] - By default, the command queries the 'fetch' capabilities. If true, it will ask for the 'push' capabilities.
 * @param {Object<string, string>} [args.headers] - Additional headers to include in HTTP requests, similar to git's `extraHeader` config
 * @param {1 | 2} [args.protocolVersion = 2] - Which version of the Git Protocol to use.
 * @param {string} [args.prefix] - Only list refs that start with this prefix
 * @param {boolean} [args.symrefs = false] - Include symbolic ref targets
 * @param {boolean} [args.peelTags = false] - Include annotated tag peeled targets
 *
 * @returns {Promise<ServerRef[]>} Resolves successfully with an array of ServerRef objects
 * @see ServerRef
 *
 * @example
 * // List all the branches on a repo
 * let refs = await git.listServerRefs({
 *   http,
 *   corsProxy: "https://cors.isomorphic-git.org",
 *   url: "https://github.com/isomorphic-git/isomorphic-git.git",
 *   prefix: "refs/heads/",
 * });
 * console.log(refs);
 *
 * @example
 * // Get the default branch on a repo
 * let refs = await git.listServerRefs({
 *   http,
 *   corsProxy: "https://cors.isomorphic-git.org",
 *   url: "https://github.com/isomorphic-git/isomorphic-git.git",
 *   prefix: "HEAD",
 *   symrefs: true,
 * });
 * console.log(refs);
 *
 * @example
 * // List all the tags on a repo
 * let refs = await git.listServerRefs({
 *   http,
 *   corsProxy: "https://cors.isomorphic-git.org",
 *   url: "https://github.com/isomorphic-git/isomorphic-git.git",
 *   prefix: "refs/tags/",
 *   peelTags: true,
 * });
 * console.log(refs);
 *
 * @example
 * // List all the pull requests on a repo
 * let refs = await git.listServerRefs({
 *   http,
 *   corsProxy: "https://cors.isomorphic-git.org",
 *   url: "https://github.com/isomorphic-git/isomorphic-git.git",
 *   prefix: "refs/pull/",
 * });
 * console.log(refs);
 *
 */
async function listServerRefs({
  http,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  corsProxy,
  url,
  headers = {},
  forPush = false,
  protocolVersion = 2,
  prefix,
  symrefs,
  peelTags,
}) {
  try {
    assertParameter('http', http);
    assertParameter('url', url);

    const remote = await GitRemoteHTTP.discover({
      http,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      corsProxy,
      service: forPush ? 'git-receive-pack' : 'git-upload-pack',
      url,
      headers,
      protocolVersion,
    });

    if (remote.protocolVersion === 1) {
      return formatInfoRefs(remote, prefix, symrefs, peelTags)
    }

    // Protocol Version 2
    const body = await writeListRefsRequest({ prefix, symrefs, peelTags });

    const res = await GitRemoteHTTP.connect({
      http,
      auth: remote.auth,
      headers,
      corsProxy,
      service: forPush ? 'git-receive-pack' : 'git-upload-pack',
      url,
      body,
    });

    return parseListRefsResponse(res.body)
  } catch (err) {
    err.caller = 'git.listServerRefs';
    throw err
  }
}

// @ts-check

/**
 * List tags
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 *
 * @returns {Promise<Array<string>>} Resolves successfully with an array of tag names
 *
 * @example
 * let tags = await git.listTags({ fs, dir: '/tutorial' })
 * console.log(tags)
 *
 */
async function listTags({ fs, dir, gitdir = join(dir, '.git') }) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    return GitRefManager.listTags({ fs: new FileSystem(fs), gitdir })
  } catch (err) {
    err.caller = 'git.listTags';
    throw err
  }
}

async function resolveCommit({ fs, cache, gitdir, oid }) {
  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
  // Resolve annotated tag objects to whatever
  if (type === 'tag') {
    oid = GitAnnotatedTag.from(object).parse().object;
    return resolveCommit({ fs, cache, gitdir, oid })
  }
  if (type !== 'commit') {
    throw new ObjectTypeError(oid, type, 'commit')
  }
  return { commit: GitCommit.from(object), oid }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} args.oid
 *
 * @returns {Promise<ReadCommitResult>} Resolves successfully with a git commit object
 * @see ReadCommitResult
 * @see CommitObject
 *
 */
async function _readCommit({ fs, cache, gitdir, oid }) {
  const { commit, oid: commitOid } = await resolveCommit({
    fs,
    cache,
    gitdir,
    oid,
  });
  const result = {
    oid: commitOid,
    commit: commit.parse(),
    payload: commit.withoutSignature(),
  };
  // @ts-ignore
  return result
}

function compareAge(a, b) {
  return a.committer.timestamp - b.committer.timestamp
}

// @ts-check

// the empty file content object id
const EMPTY_OID = 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391';

async function resolveFileIdInTree({ fs, cache, gitdir, oid, fileId }) {
  if (fileId === EMPTY_OID) return
  const _oid = oid;
  let filepath;
  const result = await resolveTree({ fs, cache, gitdir, oid });
  const tree = result.tree;
  if (fileId === result.oid) {
    filepath = result.path;
  } else {
    filepath = await _resolveFileId({
      fs,
      cache,
      gitdir,
      tree,
      fileId,
      oid: _oid,
    });
    if (Array.isArray(filepath)) {
      if (filepath.length === 0) filepath = undefined;
      else if (filepath.length === 1) filepath = filepath[0];
    }
  }
  return filepath
}

async function _resolveFileId({
  fs,
  cache,
  gitdir,
  tree,
  fileId,
  oid,
  filepaths = [],
  parentPath = '',
}) {
  const walks = tree.entries().map(function(entry) {
    let result;
    if (entry.oid === fileId) {
      result = join(parentPath, entry.path);
      filepaths.push(result);
    } else if (entry.type === 'tree') {
      result = _readObject({
        fs,
        cache,
        gitdir,
        oid: entry.oid,
      }).then(function({ object }) {
        return _resolveFileId({
          fs,
          cache,
          gitdir,
          tree: GitTree.from(object),
          fileId,
          oid,
          filepaths,
          parentPath: join(parentPath, entry.path),
        })
      });
    }
    return result
  });

  await Promise.all(walks);
  return filepaths
}

// @ts-check

/**
 * Get commit descriptions from the git history
 *
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string=} args.filepath optional get the commit for the filepath only
 * @param {string} args.ref
 * @param {number|void} args.depth
 * @param {boolean=} [args.force=false] do not throw error if filepath is not exist (works only for a single file). defaults to false
 * @param {boolean=} [args.follow=false] Continue listing the history of a file beyond renames (works only for a single file). defaults to false
 * @param {boolean=} args.follow Continue listing the history of a file beyond renames (works only for a single file). defaults to false
 *
 * @returns {Promise<Array<ReadCommitResult>>} Resolves to an array of ReadCommitResult objects
 * @see ReadCommitResult
 * @see CommitObject
 *
 * @example
 * let commits = await git.log({ dir: '$input((/))', depth: $input((5)), ref: '$input((master))' })
 * console.log(commits)
 *
 */
async function _log({
  fs,
  cache,
  gitdir,
  filepath,
  ref,
  depth,
  since,
  force,
  follow,
}) {
  const sinceTimestamp =
    typeof since === 'undefined'
      ? undefined
      : Math.floor(since.valueOf() / 1000);
  // TODO: In the future, we may want to have an API where we return a
  // async iterator that emits commits.
  const commits = [];
  const shallowCommits = await GitShallowManager.read({ fs, gitdir });
  const oid = await GitRefManager.resolve({ fs, gitdir, ref });
  const tips = [await _readCommit({ fs, cache, gitdir, oid })];
  let lastFileOid;
  let lastCommit;
  let isOk;

  function endCommit(commit) {
    if (isOk && filepath) commits.push(commit);
  }

  while (tips.length > 0) {
    const commit = tips.pop();

    // Stop the log if we've hit the age limit
    if (
      sinceTimestamp !== undefined &&
      commit.commit.committer.timestamp <= sinceTimestamp
    ) {
      break
    }

    if (filepath) {
      let vFileOid;
      try {
        vFileOid = await resolveFilepath({
          fs,
          cache,
          gitdir,
          oid: commit.commit.tree,
          filepath,
        });
        if (lastCommit && lastFileOid !== vFileOid) {
          commits.push(lastCommit);
        }
        lastFileOid = vFileOid;
        lastCommit = commit;
        isOk = true;
      } catch (e) {
        if (e instanceof NotFoundError) {
          let found = follow && lastFileOid;
          if (found) {
            found = await resolveFileIdInTree({
              fs,
              cache,
              gitdir,
              oid: commit.commit.tree,
              fileId: lastFileOid,
            });
            if (found) {
              if (Array.isArray(found)) {
                if (lastCommit) {
                  const lastFound = await resolveFileIdInTree({
                    fs,
                    cache,
                    gitdir,
                    oid: lastCommit.commit.tree,
                    fileId: lastFileOid,
                  });
                  if (Array.isArray(lastFound)) {
                    found = found.filter(p => lastFound.indexOf(p) === -1);
                    if (found.length === 1) {
                      found = found[0];
                      filepath = found;
                      if (lastCommit) commits.push(lastCommit);
                    } else {
                      found = false;
                      if (lastCommit) commits.push(lastCommit);
                      break
                    }
                  }
                }
              } else {
                filepath = found;
                if (lastCommit) commits.push(lastCommit);
              }
            }
          }
          if (!found) {
            if (isOk && lastFileOid) {
              commits.push(lastCommit);
              if (!force) break
            }
            if (!force && !follow) throw e
          }
          lastCommit = commit;
          isOk = false;
        } else throw e
      }
    } else {
      commits.push(commit);
    }

    // Stop the loop if we have enough commits now.
    if (depth !== undefined && commits.length === depth) {
      endCommit(commit);
      break
    }

    // If this is not a shallow commit...
    if (!shallowCommits.has(commit.oid)) {
      // Add the parents of this commit to the queue
      // Note: for the case of a commit with no parents, it will concat an empty array, having no net effect.
      for (const oid of commit.commit.parent) {
        const commit = await _readCommit({ fs, cache, gitdir, oid });
        if (!tips.map(commit => commit.oid).includes(commit.oid)) {
          tips.push(commit);
        }
      }
    }

    // Stop the loop if there are no more commit parents
    if (tips.length === 0) {
      endCommit(commit);
    }

    // Process tips in order by age
    tips.sort((a, b) => compareAge(a.commit, b.commit));
  }
  return commits
}

// @ts-check

/**
 * Get commit descriptions from the git history
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string=} args.filepath optional get the commit for the filepath only
 * @param {string} [args.ref = 'HEAD'] - The commit to begin walking backwards through the history from
 * @param {number=} [args.depth] - Limit the number of commits returned. No limit by default.
 * @param {Date} [args.since] - Return history newer than the given date. Can be combined with `depth` to get whichever is shorter.
 * @param {boolean=} [args.force=false] do not throw error if filepath is not exist (works only for a single file). defaults to false
 * @param {boolean=} [args.follow=false] Continue listing the history of a file beyond renames (works only for a single file). defaults to false
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<Array<ReadCommitResult>>} Resolves to an array of ReadCommitResult objects
 * @see ReadCommitResult
 * @see CommitObject
 *
 * @example
 * let commits = await git.log({
 *   fs,
 *   dir: '/tutorial',
 *   depth: 5,
 *   ref: 'main'
 * })
 * console.log(commits)
 *
 */
async function log({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  filepath,
  ref = 'HEAD',
  depth,
  since, // Date
  force,
  follow,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);

    return await _log({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      filepath,
      ref,
      depth,
      since,
      force,
      follow,
    })
  } catch (err) {
    err.caller = 'git.log';
    throw err
  }
}

// @ts-check

/**
 *
 * @typedef {Object} MergeResult - Returns an object with a schema like this:
 * @property {string} [oid] - The SHA-1 object id that is now at the head of the branch. Absent only if `dryRun` was specified and `mergeCommit` is true.
 * @property {boolean} [alreadyMerged] - True if the branch was already merged so no changes were made
 * @property {boolean} [fastForward] - True if it was a fast-forward merge
 * @property {boolean} [mergeCommit] - True if merge resulted in a merge commit
 * @property {string} [tree] - The SHA-1 object id of the tree resulting from a merge commit
 *
 */

/**
 * Merge two branches
 *
 * Currently it will fail if multiple candidate merge bases are found. (It doesn't yet implement the recursive merge strategy.)
 *
 * Currently it does not support selecting alternative merge strategies.
 *
 * Currently it is not possible to abort an incomplete merge. To restore the worktree to a clean state, you will need to checkout an earlier commit.
 *
 * Currently it does not directly support the behavior of `git merge --continue`. To complete a merge after manual conflict resolution, you will need to add and commit the files manually, and specify the appropriate parent commits.
 *
 * ## Manually resolving merge conflicts
 * By default, if isomorphic-git encounters a merge conflict it cannot resolve using the builtin diff3 algorithm or provided merge driver, it will abort and throw a `MergeNotSupportedError`.
 * This leaves the index and working tree untouched.
 *
 * When `abortOnConflict` is set to `false`, and a merge conflict cannot be automatically resolved, a `MergeConflictError` is thrown and the results of the incomplete merge will be written to the working directory.
 * This includes conflict markers in files with unresolved merge conflicts.
 *
 * To complete the merge, edit the conflicting files as you see fit, and then add and commit the resolved merge.
 *
 * For a proper merge commit, be sure to specify the branches or commits you are merging in the `parent` argument to `git.commit`.
 * For example, say we are merging the branch `feature` into the branch `main` and there is a conflict we want to resolve manually.
 * The flow would look like this:
 *
 * ```
 * await git.merge({
 *   fs,
 *   dir,
 *   ours: 'main',
 *   theirs: 'feature',
 *   abortOnConflict: false,
 * }).catch(e => {
 *   if (e instanceof Errors.MergeConflictError) {
 *     console.log(
 *       'Automatic merge failed for the following files: '
 *       + `${e.data}. `
 *       + 'Resolve these conflicts and then commit your changes.'
 *     )
 *   } else throw e
 * })
 *
 * // This is the where we manually edit the files that have been written to the working directory
 * // ...
 * // Files have been edited and we are ready to commit
 *
 * await git.add({
 *   fs,
 *   dir,
 *   filepath: '.',
 * })
 *
 * await git.commit({
 *   fs,
 *   dir,
 *   ref: 'main',
 *   message: "Merge branch 'feature' into main",
 *   parent: ['main', 'feature'], // Be sure to specify the parents when creating a merge commit
 * })
 * ```
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {SignCallback} [args.onSign] - a PGP signing implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ours] - The branch receiving the merge. If undefined, defaults to the current branch.
 * @param {string} args.theirs - The branch to be merged
 * @param {boolean} [args.fastForward = true] - If false, create a merge commit in all cases.
 * @param {boolean} [args.fastForwardOnly = false] - If true, then non-fast-forward merges will throw an Error instead of performing a merge.
 * @param {boolean} [args.dryRun = false] - If true, simulates a merge so you can test whether it would succeed.
 * @param {boolean} [args.noUpdateBranch = false] - If true, does not update the branch pointer after creating the commit.
 * @param {boolean} [args.abortOnConflict = true] - If true, merges with conflicts will not update the worktree or index.
 * @param {string} [args.message] - Overrides the default auto-generated merge commit message
 * @param {Object} [args.author] - passed to [commit](commit.md) when creating a merge commit
 * @param {string} [args.author.name] - Default is `user.name` config.
 * @param {string} [args.author.email] - Default is `user.email` config.
 * @param {number} [args.author.timestamp=Math.floor(Date.now()/1000)] - Set the author timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.author.timezoneOffset] - Set the author timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {Object} [args.committer] - passed to [commit](commit.md) when creating a merge commit
 * @param {string} [args.committer.name] - Default is `user.name` config.
 * @param {string} [args.committer.email] - Default is `user.email` config.
 * @param {number} [args.committer.timestamp=Math.floor(Date.now()/1000)] - Set the committer timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.committer.timezoneOffset] - Set the committer timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {string} [args.signingKey] - passed to [commit](commit.md) when creating a merge commit
 * @param {object} [args.cache] - a [cache](cache.md) object
 * @param {MergeDriverCallback} [args.mergeDriver] - a [merge driver](mergeDriver.md) implementation
 *
 * @returns {Promise<MergeResult>} Resolves to a description of the merge operation
 * @see MergeResult
 *
 * @example
 * let m = await git.merge({
 *   fs,
 *   dir: '/tutorial',
 *   ours: 'main',
 *   theirs: 'remotes/origin/main'
 * })
 * console.log(m)
 *
 */
async function merge({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, '.git'),
  ours,
  theirs,
  fastForward = true,
  fastForwardOnly = false,
  dryRun = false,
  noUpdateBranch = false,
  abortOnConflict = true,
  message,
  author: _author,
  committer: _committer,
  signingKey,
  cache = {},
  mergeDriver,
}) {
  try {
    assertParameter('fs', _fs);
    if (signingKey) {
      assertParameter('onSign', onSign);
    }
    const fs = new FileSystem(_fs);

    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author && (!fastForwardOnly || !fastForward)) {
      throw new MissingNameError('author')
    }

    const committer = await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer,
    });
    if (!committer && (!fastForwardOnly || !fastForward)) {
      throw new MissingNameError('committer')
    }

    return await _merge({
      fs,
      cache,
      dir,
      gitdir,
      ours,
      theirs,
      fastForward,
      fastForwardOnly,
      dryRun,
      noUpdateBranch,
      abortOnConflict,
      message,
      author,
      committer,
      signingKey,
      onSign,
      mergeDriver,
    })
  } catch (err) {
    err.caller = 'git.merge';
    throw err
  }
}

/**
 * @enum {number}
 */
const types = {
  commit: 0b0010000,
  tree: 0b0100000,
  blob: 0b0110000,
  tag: 0b1000000,
  ofs_delta: 0b1100000,
  ref_delta: 0b1110000,
};

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string[]} args.oids
 */
async function _pack({
  fs,
  cache,
  dir,
  gitdir = join(dir, '.git'),
  oids,
}) {
  const hash = new Hash();
  const outputStream = [];
  function write(chunk, enc) {
    const buff = Buffer.from(chunk, enc);
    outputStream.push(buff);
    hash.update(buff);
  }
  async function writeObject({ stype, object }) {
    // Object type is encoded in bits 654
    const type = types[stype];
    // The length encoding gets complicated.
    let length = object.length;
    // Whether the next byte is part of the variable-length encoded number
    // is encoded in bit 7
    let multibyte = length > 0b1111 ? 0b10000000 : 0b0;
    // Last four bits of length is encoded in bits 3210
    const lastFour = length & 0b1111;
    // Discard those bits
    length = length >>> 4;
    // The first byte is then (1-bit multibyte?), (3-bit type), (4-bit least sig 4-bits of length)
    let byte = (multibyte | type | lastFour).toString(16);
    write(byte, 'hex');
    // Now we keep chopping away at length 7-bits at a time until its zero,
    // writing out the bytes in what amounts to little-endian order.
    while (multibyte) {
      multibyte = length > 0b01111111 ? 0b10000000 : 0b0;
      byte = multibyte | (length & 0b01111111);
      write(padHex(2, byte), 'hex');
      length = length >>> 7;
    }
    // Lastly, we can compress and write the object.
    write(Buffer.from(await deflate(object)));
  }
  write('PACK');
  write('00000002', 'hex');
  // Write a 4 byte (32-bit) int
  write(padHex(8, oids.length), 'hex');
  for (const oid of oids) {
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    await writeObject({ write, object, stype: type });
  }
  // Write SHA1 checksum
  const digest = hash.digest();
  outputStream.push(digest);
  return outputStream
}

// @ts-check

/**
 *
 * @typedef {Object} PackObjectsResult The packObjects command returns an object with two properties:
 * @property {string} filename - The suggested filename for the packfile if you want to save it to disk somewhere. It includes the packfile SHA.
 * @property {Uint8Array} [packfile] - The packfile contents. Not present if `write` parameter was true, in which case the packfile was written straight to disk.
 */

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string[]} args.oids
 * @param {boolean} args.write
 *
 * @returns {Promise<PackObjectsResult>}
 * @see PackObjectsResult
 */
async function _packObjects({ fs, cache, gitdir, oids, write }) {
  const buffers = await _pack({ fs, cache, gitdir, oids });
  const packfile = Buffer.from(await collect(buffers));
  const packfileSha = packfile.slice(-20).toString('hex');
  const filename = `pack-${packfileSha}.pack`;
  if (write) {
    await fs.write(join(gitdir, `objects/pack/${filename}`), packfile);
    return { filename }
  }
  return {
    filename,
    packfile: new Uint8Array(packfile),
  }
}

// @ts-check

/**
 *
 * @typedef {Object} PackObjectsResult The packObjects command returns an object with two properties:
 * @property {string} filename - The suggested filename for the packfile if you want to save it to disk somewhere. It includes the packfile SHA.
 * @property {Uint8Array} [packfile] - The packfile contents. Not present if `write` parameter was true, in which case the packfile was written straight to disk.
 */

/**
 * Create a packfile from an array of SHA-1 object ids
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string[]} args.oids - An array of SHA-1 object ids to be included in the packfile
 * @param {boolean} [args.write = false] - Whether to save the packfile to disk or not
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<PackObjectsResult>} Resolves successfully when the packfile is ready with the filename and buffer
 * @see PackObjectsResult
 *
 * @example
 * // Create a packfile containing only an empty tree
 * let { packfile } = await git.packObjects({
 *   fs,
 *   dir: '/tutorial',
 *   oids: ['4b825dc642cb6eb9a060e54bf8d69288fbee4904']
 * })
 * console.log(packfile)
 *
 */
async function packObjects({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oids,
  write = false,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oids', oids);

    return await _packObjects({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oids,
      write,
    })
  } catch (err) {
    err.caller = 'git.packObjects';
    throw err
  }
}

// @ts-check

/**
 * Fetch and merge commits from a remote repository
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {HttpClient} args.http - an HTTP client
 * @param {ProgressCallback} [args.onProgress] - optional progress event callback
 * @param {MessageCallback} [args.onMessage] - optional message event callback
 * @param {AuthCallback} [args.onAuth] - optional auth fill callback
 * @param {AuthFailureCallback} [args.onAuthFailure] - optional auth rejected callback
 * @param {AuthSuccessCallback} [args.onAuthSuccess] - optional auth approved callback
 * @param {string} args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref] - Which branch to merge into. By default this is the currently checked out branch.
 * @param {string} [args.url] - (Added in 1.1.0) The URL of the remote repository. The default is the value set in the git config for that remote.
 * @param {string} [args.remote] - (Added in 1.1.0) If URL is not specified, determines which remote to use.
 * @param {string} [args.remoteRef] - (Added in 1.1.0) The name of the branch on the remote to fetch. By default this is the configured remote tracking branch.
 * @param {boolean} [args.prune = false] - Delete local remote-tracking branches that are not present on the remote
 * @param {boolean} [args.pruneTags = false] - Prune local tags that don’t exist on the remote, and force-update those tags that differ
 * @param {string} [args.corsProxy] - Optional [CORS proxy](https://www.npmjs.com/%40isomorphic-git/cors-proxy). Overrides value in repo config.
 * @param {boolean} [args.singleBranch = false] - Instead of the default behavior of fetching all the branches, only fetch a single branch.
 * @param {boolean} [args.fastForward = true] -  If false, only create merge commits.
 * @param {boolean} [args.fastForwardOnly = false] - Only perform simple fast-forward merges. (Don't create merge commits.)
 * @param {Object<string, string>} [args.headers] - Additional headers to include in HTTP requests, similar to git's `extraHeader` config
 * @param {Object} [args.author] - The details about the author.
 * @param {string} [args.author.name] - Default is `user.name` config.
 * @param {string} [args.author.email] - Default is `user.email` config.
 * @param {number} [args.author.timestamp=Math.floor(Date.now()/1000)] - Set the author timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.author.timezoneOffset] - Set the author timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {Object} [args.committer = author] - The details about the commit committer, in the same format as the author parameter. If not specified, the author details are used.
 * @param {string} [args.committer.name] - Default is `user.name` config.
 * @param {string} [args.committer.email] - Default is `user.email` config.
 * @param {number} [args.committer.timestamp=Math.floor(Date.now()/1000)] - Set the committer timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.committer.timezoneOffset] - Set the committer timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {string} [args.signingKey] - passed to [commit](commit.md) when creating a merge commit
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<void>} Resolves successfully when pull operation completes
 *
 * @example
 * await git.pull({
 *   fs,
 *   http,
 *   dir: '/tutorial',
 *   ref: 'main',
 *   singleBranch: true
 * })
 * console.log('done')
 *
 */
async function pull({
  fs: _fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  url,
  remote,
  remoteRef,
  prune = false,
  pruneTags = false,
  fastForward = true,
  fastForwardOnly = false,
  corsProxy,
  singleBranch,
  headers = {},
  author: _author,
  committer: _committer,
  signingKey,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);

    const fs = new FileSystem(_fs);

    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author) throw new MissingNameError('author')

    const committer = await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer,
    });
    if (!committer) throw new MissingNameError('committer')

    return await _pull({
      fs,
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      dir,
      gitdir,
      ref,
      url,
      remote,
      remoteRef,
      fastForward,
      fastForwardOnly,
      corsProxy,
      singleBranch,
      headers,
      author,
      committer,
      signingKey,
      prune,
      pruneTags,
    })
  } catch (err) {
    err.caller = 'git.pull';
    throw err
  }
}

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} [args.dir]
 * @param {string} args.gitdir
 * @param {Iterable<string>} args.start
 * @param {Iterable<string>} args.finish
 * @returns {Promise<Set<string>>}
 */
async function listCommitsAndTags({
  fs,
  cache,
  dir,
  gitdir = join(dir, '.git'),
  start,
  finish,
}) {
  const shallows = await GitShallowManager.read({ fs, gitdir });
  const startingSet = new Set();
  const finishingSet = new Set();
  for (const ref of start) {
    startingSet.add(await GitRefManager.resolve({ fs, gitdir, ref }));
  }
  for (const ref of finish) {
    // We may not have these refs locally so we must try/catch
    try {
      const oid = await GitRefManager.resolve({ fs, gitdir, ref });
      finishingSet.add(oid);
    } catch (err) {}
  }
  const visited = new Set();
  // Because git commits are named by their hash, there is no
  // way to construct a cycle. Therefore we won't worry about
  // setting a default recursion limit.
  async function walk(oid) {
    visited.add(oid);
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    // Recursively resolve annotated tags
    if (type === 'tag') {
      const tag = GitAnnotatedTag.from(object);
      const commit = tag.headers().object;
      return walk(commit)
    }
    if (type !== 'commit') {
      throw new ObjectTypeError(oid, type, 'commit')
    }
    if (!shallows.has(oid)) {
      const commit = GitCommit.from(object);
      const parents = commit.headers().parent;
      for (oid of parents) {
        if (!finishingSet.has(oid) && !visited.has(oid)) {
          await walk(oid);
        }
      }
    }
  }
  // Let's go walking!
  for (const oid of startingSet) {
    await walk(oid);
  }
  return visited
}

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} [args.dir]
 * @param {string} args.gitdir
 * @param {Iterable<string>} args.oids
 * @returns {Promise<Set<string>>}
 */
async function listObjects({
  fs,
  cache,
  dir,
  gitdir = join(dir, '.git'),
  oids,
}) {
  const visited = new Set();
  // We don't do the purest simplest recursion, because we can
  // avoid reading Blob objects entirely since the Tree objects
  // tell us which oids are Blobs and which are Trees.
  async function walk(oid) {
    if (visited.has(oid)) return
    visited.add(oid);
    const { type, object } = await _readObject({ fs, cache, gitdir, oid });
    if (type === 'tag') {
      const tag = GitAnnotatedTag.from(object);
      const obj = tag.headers().object;
      await walk(obj);
    } else if (type === 'commit') {
      const commit = GitCommit.from(object);
      const tree = commit.headers().tree;
      await walk(tree);
    } else if (type === 'tree') {
      const tree = GitTree.from(object);
      for (const entry of tree) {
        // add blobs to the set
        // skip over submodules whose type is 'commit'
        if (entry.type === 'blob') {
          visited.add(entry.oid);
        }
        // recurse for trees
        if (entry.type === 'tree') {
          await walk(entry.oid);
        }
      }
    }
  }
  // Let's go walking!
  for (const oid of oids) {
    await walk(oid);
  }
  return visited
}

async function parseReceivePackResponse(packfile) {
  /** @type PushResult */
  const result = {};
  let response = '';
  const read = GitPktLine.streamReader(packfile);
  let line = await read();
  while (line !== true) {
    if (line !== null) response += line.toString('utf8') + '\n';
    line = await read();
  }

  const lines = response.toString('utf8').split('\n');
  // We're expecting "unpack {unpack-result}"
  line = lines.shift();
  if (!line.startsWith('unpack ')) {
    throw new ParseError('unpack ok" or "unpack [error message]', line)
  }
  result.ok = line === 'unpack ok';
  if (!result.ok) {
    result.error = line.slice('unpack '.length);
  }
  result.refs = {};
  for (const line of lines) {
    if (line.trim() === '') continue
    const status = line.slice(0, 2);
    const refAndMessage = line.slice(3);
    let space = refAndMessage.indexOf(' ');
    if (space === -1) space = refAndMessage.length;
    const ref = refAndMessage.slice(0, space);
    const error = refAndMessage.slice(space + 1);
    result.refs[ref] = {
      ok: status === 'ok',
      error,
    };
  }
  return result
}

async function writeReceivePackRequest({
  capabilities = [],
  triplets = [],
}) {
  const packstream = [];
  let capsFirstLine = `\x00 ${capabilities.join(' ')}`;
  for (const trip of triplets) {
    packstream.push(
      GitPktLine.encode(
        `${trip.oldoid} ${trip.oid} ${trip.fullRef}${capsFirstLine}\n`
      )
    );
    capsFirstLine = '';
  }
  packstream.push(GitPktLine.flush());
  return packstream
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {HttpClient} args.http
 * @param {ProgressCallback} [args.onProgress]
 * @param {MessageCallback} [args.onMessage]
 * @param {AuthCallback} [args.onAuth]
 * @param {AuthFailureCallback} [args.onAuthFailure]
 * @param {AuthSuccessCallback} [args.onAuthSuccess]
 * @param {string} args.gitdir
 * @param {string} [args.ref]
 * @param {string} [args.remoteRef]
 * @param {string} [args.remote]
 * @param {boolean} [args.force = false]
 * @param {boolean} [args.delete = false]
 * @param {string} [args.url]
 * @param {string} [args.corsProxy]
 * @param {Object<string, string>} [args.headers]
 *
 * @returns {Promise<PushResult>}
 */
async function _push({
  fs,
  cache,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  gitdir,
  ref: _ref,
  remoteRef: _remoteRef,
  remote,
  url: _url,
  force = false,
  delete: _delete = false,
  corsProxy,
  headers = {},
}) {
  const ref = _ref || (await _currentBranch({ fs, gitdir }));
  if (typeof ref === 'undefined') {
    throw new MissingParameterError('ref')
  }
  const config = await GitConfigManager.get({ fs, gitdir });
  // Figure out what remote to use.
  remote =
    remote ||
    (await config.get(`branch.${ref}.pushRemote`)) ||
    (await config.get('remote.pushDefault')) ||
    (await config.get(`branch.${ref}.remote`)) ||
    'origin';
  // Lookup the URL for the given remote.
  const url =
    _url ||
    (await config.get(`remote.${remote}.pushurl`)) ||
    (await config.get(`remote.${remote}.url`));
  if (typeof url === 'undefined') {
    throw new MissingParameterError('remote OR url')
  }
  // Figure out what remote ref to use.
  const remoteRef = _remoteRef || (await config.get(`branch.${ref}.merge`));
  if (typeof url === 'undefined') {
    throw new MissingParameterError('remoteRef')
  }

  if (corsProxy === undefined) {
    corsProxy = await config.get('http.corsProxy');
  }

  const fullRef = await GitRefManager.expand({ fs, gitdir, ref });
  const oid = _delete
    ? '0000000000000000000000000000000000000000'
    : await GitRefManager.resolve({ fs, gitdir, ref: fullRef });

  /** @type typeof import("../managers/GitRemoteHTTP").GitRemoteHTTP */
  const GitRemoteHTTP = GitRemoteManager.getRemoteHelperFor({ url });
  const httpRemote = await GitRemoteHTTP.discover({
    http,
    onAuth,
    onAuthSuccess,
    onAuthFailure,
    corsProxy,
    service: 'git-receive-pack',
    url,
    headers,
    protocolVersion: 1,
  });
  const auth = httpRemote.auth; // hack to get new credentials from CredentialManager API
  let fullRemoteRef;
  if (!remoteRef) {
    fullRemoteRef = fullRef;
  } else {
    try {
      fullRemoteRef = await GitRefManager.expandAgainstMap({
        ref: remoteRef,
        map: httpRemote.refs,
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        // The remote reference doesn't exist yet.
        // If it is fully specified, use that value. Otherwise, treat it as a branch.
        fullRemoteRef = remoteRef.startsWith('refs/')
          ? remoteRef
          : `refs/heads/${remoteRef}`;
      } else {
        throw err
      }
    }
  }
  const oldoid =
    httpRemote.refs.get(fullRemoteRef) ||
    '0000000000000000000000000000000000000000';

  // Remotes can always accept thin-packs UNLESS they specify the 'no-thin' capability
  const thinPack = !httpRemote.capabilities.has('no-thin');

  let objects = new Set();
  if (!_delete) {
    const finish = [...httpRemote.refs.values()];
    let skipObjects = new Set();

    // If remote branch is present, look for a common merge base.
    if (oldoid !== '0000000000000000000000000000000000000000') {
      // trick to speed up common force push scenarios
      const mergebase = await _findMergeBase({
        fs,
        cache,
        gitdir,
        oids: [oid, oldoid],
      });
      for (const oid of mergebase) finish.push(oid);
      if (thinPack) {
        skipObjects = await listObjects({ fs, cache, gitdir, oids: mergebase });
      }
    }

    // If remote does not have the commit, figure out the objects to send
    if (!finish.includes(oid)) {
      const commits = await listCommitsAndTags({
        fs,
        cache,
        gitdir,
        start: [oid],
        finish,
      });
      objects = await listObjects({ fs, cache, gitdir, oids: commits });
    }

    if (thinPack) {
      // If there's a default branch for the remote lets skip those objects too.
      // Since this is an optional optimization, we just catch and continue if there is
      // an error (because we can't find a default branch, or can't find a commit, etc)
      try {
        // Sadly, the discovery phase with 'forPush' doesn't return symrefs, so we have to
        // rely on existing ones.
        const ref = await GitRefManager.resolve({
          fs,
          gitdir,
          ref: `refs/remotes/${remote}/HEAD`,
          depth: 2,
        });
        const { oid } = await GitRefManager.resolveAgainstMap({
          ref: ref.replace(`refs/remotes/${remote}/`, ''),
          fullref: ref,
          map: httpRemote.refs,
        });
        const oids = [oid];
        for (const oid of await listObjects({ fs, cache, gitdir, oids })) {
          skipObjects.add(oid);
        }
      } catch (e) {}

      // Remove objects that we know the remote already has
      for (const oid of skipObjects) {
        objects.delete(oid);
      }
    }

    if (oid === oldoid) force = true;
    if (!force) {
      // Is it a tag that already exists?
      if (
        fullRef.startsWith('refs/tags') &&
        oldoid !== '0000000000000000000000000000000000000000'
      ) {
        throw new PushRejectedError('tag-exists')
      }
      // Is it a non-fast-forward commit?
      if (
        oid !== '0000000000000000000000000000000000000000' &&
        oldoid !== '0000000000000000000000000000000000000000' &&
        !(await _isDescendent({
          fs,
          cache,
          gitdir,
          oid,
          ancestor: oldoid,
          depth: -1,
        }))
      ) {
        throw new PushRejectedError('not-fast-forward')
      }
    }
  }
  // We can only safely use capabilities that the server also understands.
  // For instance, AWS CodeCommit aborts a push if you include the `agent`!!!
  const capabilities = filterCapabilities(
    [...httpRemote.capabilities],
    ['report-status', 'side-band-64k', `agent=${pkg.agent}`]
  );
  const packstream1 = await writeReceivePackRequest({
    capabilities,
    triplets: [{ oldoid, oid, fullRef: fullRemoteRef }],
  });
  const packstream2 = _delete
    ? []
    : await _pack({
        fs,
        cache,
        gitdir,
        oids: [...objects],
      });
  const res = await GitRemoteHTTP.connect({
    http,
    onProgress,
    corsProxy,
    service: 'git-receive-pack',
    url,
    auth,
    headers,
    body: [...packstream1, ...packstream2],
  });
  const { packfile, progress } = await GitSideBand.demux(res.body);
  if (onMessage) {
    const lines = splitLines(progress);
    forAwait(lines, async line => {
      await onMessage(line);
    });
  }
  // Parse the response!
  const result = await parseReceivePackResponse(packfile);
  if (res.headers) {
    result.headers = res.headers;
  }

  // Update the local copy of the remote ref
  if (remote && result.ok && result.refs[fullRemoteRef].ok) {
    // TODO: I think this should actually be using a refspec transform rather than assuming 'refs/remotes/{remote}'
    const ref = `refs/remotes/${remote}/${fullRemoteRef.replace(
      'refs/heads',
      ''
    )}`;
    if (_delete) {
      await GitRefManager.deleteRef({ fs, gitdir, ref });
    } else {
      await GitRefManager.writeRef({ fs, gitdir, ref, value: oid });
    }
  }
  if (result.ok && Object.values(result.refs).every(result => result.ok)) {
    return result
  } else {
    const prettyDetails = Object.entries(result.refs)
      .filter(([k, v]) => !v.ok)
      .map(([k, v]) => `\n  - ${k}: ${v.error}`)
      .join('');
    throw new GitPushError(prettyDetails, result)
  }
}

// @ts-check

/**
 * Push a branch or tag
 *
 * The push command returns an object that describes the result of the attempted push operation.
 * *Notes:* If there were no errors, then there will be no `errors` property. There can be a mix of `ok` messages and `errors` messages.
 *
 * | param  | type [= default] | description                                                                                                                                                                                                      |
 * | ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 * | ok     | Array\<string\>  | The first item is "unpack" if the overall operation was successful. The remaining items are the names of refs that were updated successfully.                                                                    |
 * | errors | Array\<string\>  | If the overall operation threw and error, the first item will be "unpack {Overall error message}". The remaining items are individual refs that failed to be updated in the format "{ref name} {error message}". |
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {HttpClient} args.http - an HTTP client
 * @param {ProgressCallback} [args.onProgress] - optional progress event callback
 * @param {MessageCallback} [args.onMessage] - optional message event callback
 * @param {AuthCallback} [args.onAuth] - optional auth fill callback
 * @param {AuthFailureCallback} [args.onAuthFailure] - optional auth rejected callback
 * @param {AuthSuccessCallback} [args.onAuthSuccess] - optional auth approved callback
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref] - Which branch to push. By default this is the currently checked out branch.
 * @param {string} [args.url] - The URL of the remote repository. The default is the value set in the git config for that remote.
 * @param {string} [args.remote] - If URL is not specified, determines which remote to use.
 * @param {string} [args.remoteRef] - The name of the receiving branch on the remote. By default this is the configured remote tracking branch.
 * @param {boolean} [args.force = false] - If true, behaves the same as `git push --force`
 * @param {boolean} [args.delete = false] - If true, delete the remote ref
 * @param {string} [args.corsProxy] - Optional [CORS proxy](https://www.npmjs.com/%40isomorphic-git/cors-proxy). Overrides value in repo config.
 * @param {Object<string, string>} [args.headers] - Additional headers to include in HTTP requests, similar to git's `extraHeader` config
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<PushResult>} Resolves successfully when push completes with a detailed description of the operation from the server.
 * @see PushResult
 * @see RefUpdateStatus
 *
 * @example
 * let pushResult = await git.push({
 *   fs,
 *   http,
 *   dir: '/tutorial',
 *   remote: 'origin',
 *   ref: 'main',
 *   onAuth: () => ({ username: process.env.GITHUB_TOKEN }),
 * })
 * console.log(pushResult)
 *
 */
async function push({
  fs,
  http,
  onProgress,
  onMessage,
  onAuth,
  onAuthSuccess,
  onAuthFailure,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  remoteRef,
  remote = 'origin',
  url,
  force = false,
  delete: _delete = false,
  corsProxy,
  headers = {},
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('http', http);
    assertParameter('gitdir', gitdir);

    return await _push({
      fs: new FileSystem(fs),
      cache,
      http,
      onProgress,
      onMessage,
      onAuth,
      onAuthSuccess,
      onAuthFailure,
      gitdir,
      ref,
      remoteRef,
      remote,
      url,
      force,
      delete: _delete,
      corsProxy,
      headers,
    })
  } catch (err) {
    err.caller = 'git.push';
    throw err
  }
}

async function resolveBlob({ fs, cache, gitdir, oid }) {
  const { type, object } = await _readObject({ fs, cache, gitdir, oid });
  // Resolve annotated tag objects to whatever
  if (type === 'tag') {
    oid = GitAnnotatedTag.from(object).parse().object;
    return resolveBlob({ fs, cache, gitdir, oid })
  }
  if (type !== 'blob') {
    throw new ObjectTypeError(oid, type, 'blob')
  }
  return { oid, blob: new Uint8Array(object) }
}

// @ts-check

/**
 *
 * @typedef {Object} ReadBlobResult - The object returned has the following schema:
 * @property {string} oid
 * @property {Uint8Array} blob
 *
 */

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} args.oid
 * @param {string} [args.filepath]
 *
 * @returns {Promise<ReadBlobResult>} Resolves successfully with a blob object description
 * @see ReadBlobResult
 */
async function _readBlob({
  fs,
  cache,
  gitdir,
  oid,
  filepath = undefined,
}) {
  if (filepath !== undefined) {
    oid = await resolveFilepath({ fs, cache, gitdir, oid, filepath });
  }
  const blob = await resolveBlob({
    fs,
    cache,
    gitdir,
    oid,
  });
  return blob
}

// @ts-check

/**
 *
 * @typedef {Object} ReadBlobResult - The object returned has the following schema:
 * @property {string} oid
 * @property {Uint8Array} blob
 *
 */

/**
 * Read a blob object directly
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.oid - The SHA-1 object id to get. Annotated tags, commits, and trees are peeled.
 * @param {string} [args.filepath] - Don't return the object with `oid` itself, but resolve `oid` to a tree and then return the blob object at that filepath.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<ReadBlobResult>} Resolves successfully with a blob object description
 * @see ReadBlobResult
 *
 * @example
 * // Get the contents of 'README.md' in the main branch.
 * let commitOid = await git.resolveRef({ fs, dir: '/tutorial', ref: 'main' })
 * console.log(commitOid)
 * let { blob } = await git.readBlob({
 *   fs,
 *   dir: '/tutorial',
 *   oid: commitOid,
 *   filepath: 'README.md'
 * })
 * console.log(Buffer.from(blob).toString('utf8'))
 *
 */
async function readBlob({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oid,
  filepath,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);

    return await _readBlob({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid,
      filepath,
    })
  } catch (err) {
    err.caller = 'git.readBlob';
    throw err
  }
}

// @ts-check

/**
 * Read a commit object directly
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.oid - The SHA-1 object id to get. Annotated tags are peeled.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<ReadCommitResult>} Resolves successfully with a git commit object
 * @see ReadCommitResult
 * @see CommitObject
 *
 * @example
 * // Read a commit object
 * let sha = await git.resolveRef({ fs, dir: '/tutorial', ref: 'main' })
 * console.log(sha)
 * let commit = await git.readCommit({ fs, dir: '/tutorial', oid: sha })
 * console.log(commit)
 *
 */
async function readCommit({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oid,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);

    return await _readCommit({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid,
    })
  } catch (err) {
    err.caller = 'git.readCommit';
    throw err
  }
}

// @ts-check

/**
 * Read the contents of a note
 *
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} [args.ref] - The notes ref to look under
 * @param {string} args.oid
 *
 * @returns {Promise<Uint8Array>} Resolves successfully with note contents as a Buffer.
 */

async function _readNote({
  fs,
  cache,
  gitdir,
  ref = 'refs/notes/commits',
  oid,
}) {
  const parent = await GitRefManager.resolve({ gitdir, fs, ref });
  const { blob } = await _readBlob({
    fs,
    cache,
    gitdir,
    oid: parent,
    filepath: oid,
  });

  return blob
}

// @ts-check

/**
 * Read the contents of a note
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref] - The notes ref to look under
 * @param {string} args.oid - The SHA-1 object id of the object to get the note for.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<Uint8Array>} Resolves successfully with note contents as a Buffer.
 */

async function readNote({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  ref = 'refs/notes/commits',
  oid,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);
    assertParameter('oid', oid);

    return await _readNote({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      ref,
      oid,
    })
  } catch (err) {
    err.caller = 'git.readNote';
    throw err
  }
}

// @ts-check

/**
 *
 * @typedef {Object} DeflatedObject
 * @property {string} oid
 * @property {'deflated'} type
 * @property {'deflated'} format
 * @property {Uint8Array} object
 * @property {string} [source]
 *
 */

/**
 *
 * @typedef {Object} WrappedObject
 * @property {string} oid
 * @property {'wrapped'} type
 * @property {'wrapped'} format
 * @property {Uint8Array} object
 * @property {string} [source]
 *
 */

/**
 *
 * @typedef {Object} RawObject
 * @property {string} oid
 * @property {'blob'|'commit'|'tree'|'tag'} type
 * @property {'content'} format
 * @property {Uint8Array} object
 * @property {string} [source]
 *
 */

/**
 *
 * @typedef {Object} ParsedBlobObject
 * @property {string} oid
 * @property {'blob'} type
 * @property {'parsed'} format
 * @property {string} object
 * @property {string} [source]
 *
 */

/**
 *
 * @typedef {Object} ParsedCommitObject
 * @property {string} oid
 * @property {'commit'} type
 * @property {'parsed'} format
 * @property {CommitObject} object
 * @property {string} [source]
 *
 */

/**
 *
 * @typedef {Object} ParsedTreeObject
 * @property {string} oid
 * @property {'tree'} type
 * @property {'parsed'} format
 * @property {TreeObject} object
 * @property {string} [source]
 *
 */

/**
 *
 * @typedef {Object} ParsedTagObject
 * @property {string} oid
 * @property {'tag'} type
 * @property {'parsed'} format
 * @property {TagObject} object
 * @property {string} [source]
 *
 */

/**
 *
 * @typedef {ParsedBlobObject | ParsedCommitObject | ParsedTreeObject | ParsedTagObject} ParsedObject
 */

/**
 *
 * @typedef {DeflatedObject | WrappedObject | RawObject | ParsedObject } ReadObjectResult
 */

/**
 * Read a git object directly by its SHA-1 object id
 *
 * Regarding `ReadObjectResult`:
 *
 * - `oid` will be the same as the `oid` argument unless the `filepath` argument is provided, in which case it will be the oid of the tree or blob being returned.
 * - `type` of deflated objects is `'deflated'`, and `type` of wrapped objects is `'wrapped'`
 * - `format` is usually, but not always, the format you requested. Packfiles do not store each object individually compressed so if you end up reading the object from a packfile it will be returned in format 'content' even if you requested 'deflated' or 'wrapped'.
 * - `object` will be an actual Object if format is 'parsed' and the object is a commit, tree, or annotated tag. Blobs are still formatted as Buffers unless an encoding is provided in which case they'll be strings. If format is anything other than 'parsed', object will be a Buffer.
 * - `source` is the name of the packfile or loose object file where the object was found.
 *
 * The `format` parameter can have the following values:
 *
 * | param      | description                                                                                                                                                                                               |
 * | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 * | 'deflated' | Return the raw deflate-compressed buffer for an object if possible. Useful for efficiently shuffling around loose objects when you don't care about the contents and can save time by not inflating them. |
 * | 'wrapped'  | Return the inflated object buffer wrapped in the git object header if possible. This is the raw data used when calculating the SHA-1 object id of a git object.                                           |
 * | 'content'  | Return the object buffer without the git header.                                                                                                                                                          |
 * | 'parsed'   | Returns a parsed representation of the object.                                                                                                                                                            |
 *
 * The result will be in one of the following schemas:
 *
 * ## `'deflated'` format
 *
 * {@link DeflatedObject typedef}
 *
 * ## `'wrapped'` format
 *
 * {@link WrappedObject typedef}
 *
 * ## `'content'` format
 *
 * {@link RawObject typedef}
 *
 * ## `'parsed'` format
 *
 * ### parsed `'blob'` type
 *
 * {@link ParsedBlobObject typedef}
 *
 * ### parsed `'commit'` type
 *
 * {@link ParsedCommitObject typedef}
 * {@link CommitObject typedef}
 *
 * ### parsed `'tree'` type
 *
 * {@link ParsedTreeObject typedef}
 * {@link TreeObject typedef}
 * {@link TreeEntry typedef}
 *
 * ### parsed `'tag'` type
 *
 * {@link ParsedTagObject typedef}
 * {@link TagObject typedef}
 *
 * @deprecated
 * > This command is overly complicated.
 * >
 * > If you know the type of object you are reading, use [`readBlob`](./readBlob.md), [`readCommit`](./readCommit.md), [`readTag`](./readTag.md), or [`readTree`](./readTree.md).
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.oid - The SHA-1 object id to get
 * @param {'deflated' | 'wrapped' | 'content' | 'parsed'} [args.format = 'parsed'] - What format to return the object in. The choices are described in more detail below.
 * @param {string} [args.filepath] - Don't return the object with `oid` itself, but resolve `oid` to a tree and then return the object at that filepath. To return the root directory of a tree set filepath to `''`
 * @param {string} [args.encoding] - A convenience argument that only affects blobs. Instead of returning `object` as a buffer, it returns a string parsed using the given encoding.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<ReadObjectResult>} Resolves successfully with a git object description
 * @see ReadObjectResult
 *
 * @example
 * // Given a ransom SHA-1 object id, figure out what it is
 * let { type, object } = await git.readObject({
 *   fs,
 *   dir: '/tutorial',
 *   oid: '0698a781a02264a6f37ba3ff41d78067eaf0f075'
 * })
 * switch (type) {
 *   case 'commit': {
 *     console.log(object)
 *     break
 *   }
 *   case 'tree': {
 *     console.log(object)
 *     break
 *   }
 *   case 'blob': {
 *     console.log(object)
 *     break
 *   }
 *   case 'tag': {
 *     console.log(object)
 *     break
 *   }
 * }
 *
 */
async function readObject({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  oid,
  format = 'parsed',
  filepath = undefined,
  encoding = undefined,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);

    const fs = new FileSystem(_fs);
    if (filepath !== undefined) {
      oid = await resolveFilepath({
        fs,
        cache,
        gitdir,
        oid,
        filepath,
      });
    }
    // GitObjectManager does not know how to parse content, so we tweak that parameter before passing it.
    const _format = format === 'parsed' ? 'content' : format;
    const result = await _readObject({
      fs,
      cache,
      gitdir,
      oid,
      format: _format,
    });
    result.oid = oid;
    if (format === 'parsed') {
      result.format = 'parsed';
      switch (result.type) {
        case 'commit':
          result.object = GitCommit.from(result.object).parse();
          break
        case 'tree':
          result.object = GitTree.from(result.object).entries();
          break
        case 'blob':
          // Here we consider returning a raw Buffer as the 'content' format
          // and returning a string as the 'parsed' format
          if (encoding) {
            result.object = result.object.toString(encoding);
          } else {
            result.object = new Uint8Array(result.object);
            result.format = 'content';
          }
          break
        case 'tag':
          result.object = GitAnnotatedTag.from(result.object).parse();
          break
        default:
          throw new ObjectTypeError(
            result.oid,
            result.type,
            'blob|commit|tag|tree'
          )
      }
    } else if (result.format === 'deflated' || result.format === 'wrapped') {
      result.type = result.format;
    }
    return result
  } catch (err) {
    err.caller = 'git.readObject';
    throw err
  }
}

// @ts-check

/**
 *
 * @typedef {Object} ReadTagResult - The object returned has the following schema:
 * @property {string} oid - SHA-1 object id of this tag
 * @property {TagObject} tag - the parsed tag object
 * @property {string} payload - PGP signing payload
 */

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {any} args.cache
 * @param {string} args.gitdir
 * @param {string} args.oid
 *
 * @returns {Promise<ReadTagResult>}
 */
async function _readTag({ fs, cache, gitdir, oid }) {
  const { type, object } = await _readObject({
    fs,
    cache,
    gitdir,
    oid,
    format: 'content',
  });
  if (type !== 'tag') {
    throw new ObjectTypeError(oid, type, 'tag')
  }
  const tag = GitAnnotatedTag.from(object);
  const result = {
    oid,
    tag: tag.parse(),
    payload: tag.payload(),
  };
  // @ts-ignore
  return result
}

/**
 *
 * @typedef {Object} ReadTagResult - The object returned has the following schema:
 * @property {string} oid - SHA-1 object id of this tag
 * @property {TagObject} tag - the parsed tag object
 * @property {string} payload - PGP signing payload
 */

/**
 * Read an annotated tag object directly
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.oid - The SHA-1 object id to get
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<ReadTagResult>} Resolves successfully with a git object description
 * @see ReadTagResult
 * @see TagObject
 *
 */
async function readTag({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oid,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);

    return await _readTag({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid,
    })
  } catch (err) {
    err.caller = 'git.readTag';
    throw err
  }
}

// @ts-check

/**
 *
 * @typedef {Object} ReadTreeResult - The object returned has the following schema:
 * @property {string} oid - SHA-1 object id of this tree
 * @property {TreeObject} tree - the parsed tree object
 */

/**
 * Read a tree object directly
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.oid - The SHA-1 object id to get. Annotated tags and commits are peeled.
 * @param {string} [args.filepath] - Don't return the object with `oid` itself, but resolve `oid` to a tree and then return the tree object at that filepath.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<ReadTreeResult>} Resolves successfully with a git tree object
 * @see ReadTreeResult
 * @see TreeObject
 * @see TreeEntry
 *
 */
async function readTree({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  oid,
  filepath = undefined,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);

    return await _readTree({
      fs: new FileSystem(fs),
      cache,
      gitdir,
      oid,
      filepath,
    })
  } catch (err) {
    err.caller = 'git.readTree';
    throw err
  }
}

// @ts-check

/**
 * Remove a file from the git index (aka staging area)
 *
 * Note that this does NOT delete the file in the working directory.
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.filepath - The path to the file to remove from the index
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<void>} Resolves successfully once the git index has been updated
 *
 * @example
 * await git.remove({ fs, dir: '/tutorial', filepath: 'README.md' })
 * console.log('done')
 *
 */
async function remove({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  filepath,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('filepath', filepath);

    await GitIndexManager.acquire(
      { fs: new FileSystem(_fs), gitdir, cache },
      async function(index) {
        index.delete({ filepath });
      }
    );
  } catch (err) {
    err.caller = 'git.remove';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {object} args.cache
 * @param {SignCallback} [args.onSign]
 * @param {string} [args.dir]
 * @param {string} [args.gitdir=join(dir,'.git')]
 * @param {string} [args.ref]
 * @param {string} args.oid
 * @param {Object} args.author
 * @param {string} args.author.name
 * @param {string} args.author.email
 * @param {number} args.author.timestamp
 * @param {number} args.author.timezoneOffset
 * @param {Object} args.committer
 * @param {string} args.committer.name
 * @param {string} args.committer.email
 * @param {number} args.committer.timestamp
 * @param {number} args.committer.timezoneOffset
 * @param {string} [args.signingKey]
 *
 * @returns {Promise<string>}
 */

async function _removeNote({
  fs,
  cache,
  onSign,
  gitdir,
  ref = 'refs/notes/commits',
  oid,
  author,
  committer,
  signingKey,
}) {
  // Get the current note commit
  let parent;
  try {
    parent = await GitRefManager.resolve({ gitdir, fs, ref });
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err
    }
  }

  // I'm using the "empty tree" magic number here for brevity
  const result = await _readTree({
    fs,
    gitdir,
    oid: parent || '4b825dc642cb6eb9a060e54bf8d69288fbee4904',
  });
  let tree = result.tree;

  // Remove the note blob entry from the tree
  tree = tree.filter(entry => entry.path !== oid);

  // Create the new note tree
  const treeOid = await _writeTree({
    fs,
    gitdir,
    tree,
  });

  // Create the new note commit
  const commitOid = await _commit({
    fs,
    cache,
    onSign,
    gitdir,
    ref,
    tree: treeOid,
    parent: parent && [parent],
    message: `Note removed by 'isomorphic-git removeNote'\n`,
    author,
    committer,
    signingKey,
  });

  return commitOid
}

// @ts-check

/**
 * Remove an object note
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {SignCallback} [args.onSign] - a PGP signing implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref] - The notes ref to look under
 * @param {string} args.oid - The SHA-1 object id of the object to remove the note from.
 * @param {Object} [args.author] - The details about the author.
 * @param {string} [args.author.name] - Default is `user.name` config.
 * @param {string} [args.author.email] - Default is `user.email` config.
 * @param {number} [args.author.timestamp=Math.floor(Date.now()/1000)] - Set the author timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.author.timezoneOffset] - Set the author timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {Object} [args.committer = author] - The details about the note committer, in the same format as the author parameter. If not specified, the author details are used.
 * @param {string} [args.committer.name] - Default is `user.name` config.
 * @param {string} [args.committer.email] - Default is `user.email` config.
 * @param {number} [args.committer.timestamp=Math.floor(Date.now()/1000)] - Set the committer timestamp field. This is the integer number of seconds since the Unix epoch (1970-01-01 00:00:00).
 * @param {number} [args.committer.timezoneOffset] - Set the committer timezone offset field. This is the difference, in minutes, from the current timezone to UTC. Default is `(new Date()).getTimezoneOffset()`.
 * @param {string} [args.signingKey] - Sign the tag object using this private PGP key.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the commit object for the note removal.
 */

async function removeNote({
  fs: _fs,
  onSign,
  dir,
  gitdir = join(dir, '.git'),
  ref = 'refs/notes/commits',
  oid,
  author: _author,
  committer: _committer,
  signingKey,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('oid', oid);

    const fs = new FileSystem(_fs);

    const author = await normalizeAuthorObject({ fs, gitdir, author: _author });
    if (!author) throw new MissingNameError('author')

    const committer = await normalizeCommitterObject({
      fs,
      gitdir,
      author,
      committer: _committer,
    });
    if (!committer) throw new MissingNameError('committer')

    return await _removeNote({
      fs,
      cache,
      onSign,
      gitdir,
      ref,
      oid,
      author,
      committer,
      signingKey,
    })
  } catch (err) {
    err.caller = 'git.removeNote';
    throw err
  }
}

// @ts-check

/**
 * Rename a branch
 *
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {string} args.ref - The name of the new branch
 * @param {string} args.oldref - The name of the old branch
 * @param {boolean} [args.checkout = false]
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 */
async function _renameBranch({
  fs,
  gitdir,
  oldref,
  ref,
  checkout = false,
}) {
  if (ref !== cleanGitRef.clean(ref)) {
    throw new InvalidRefNameError(ref, cleanGitRef.clean(ref))
  }

  if (oldref !== cleanGitRef.clean(oldref)) {
    throw new InvalidRefNameError(oldref, cleanGitRef.clean(oldref))
  }

  const fulloldref = `refs/heads/${oldref}`;
  const fullnewref = `refs/heads/${ref}`;

  const newexist = await GitRefManager.exists({ fs, gitdir, ref: fullnewref });

  if (newexist) {
    throw new AlreadyExistsError('branch', ref, false)
  }

  const value = await GitRefManager.resolve({
    fs,
    gitdir,
    ref: fulloldref,
    depth: 1,
  });

  await GitRefManager.writeRef({ fs, gitdir, ref: fullnewref, value });
  await GitRefManager.deleteRef({ fs, gitdir, ref: fulloldref });

  if (checkout) {
    // Update HEAD
    await GitRefManager.writeSymbolicRef({
      fs,
      gitdir,
      ref: 'HEAD',
      value: fullnewref,
    });
  }
}

// @ts-check

/**
 * Rename a branch
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - What to name the branch
 * @param {string} args.oldref - What the name of the branch was
 * @param {boolean} [args.checkout = false] - Update `HEAD` to point at the newly created branch
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.renameBranch({ fs, dir: '/tutorial', ref: 'main', oldref: 'master' })
 * console.log('done')
 *
 */
async function renameBranch({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  oldref,
  checkout = false,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);
    assertParameter('oldref', oldref);
    return await _renameBranch({
      fs: new FileSystem(fs),
      gitdir,
      ref,
      oldref,
      checkout,
    })
  } catch (err) {
    err.caller = 'git.renameBranch';
    throw err
  }
}

async function hashObject$1({ gitdir, type, object }) {
  return shasum(GitObject.wrap({ type, object }))
}

// @ts-check

/**
 * Reset a file in the git index (aka staging area)
 *
 * Note that this does NOT modify the file in the working directory.
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.filepath - The path to the file to reset in the index
 * @param {string} [args.ref = 'HEAD'] - A ref to the commit to use
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<void>} Resolves successfully once the git index has been updated
 *
 * @example
 * await git.resetIndex({ fs, dir: '/tutorial', filepath: 'README.md' })
 * console.log('done')
 *
 */
async function resetIndex({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  filepath,
  ref,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('filepath', filepath);

    const fs = new FileSystem(_fs);

    let oid;
    let workdirOid;

    try {
      // Resolve commit
      oid = await GitRefManager.resolve({ fs, gitdir, ref: ref || 'HEAD' });
    } catch (e) {
      if (ref) {
        // Only throw the error if a ref is explicitly provided
        throw e
      }
    }

    // Not having an oid at this point means `resetIndex()` was called without explicit `ref` on a new git
    // repository. If that happens, we can skip resolving the file path.
    if (oid) {
      try {
        // Resolve blob
        oid = await resolveFilepath({
          fs,
          cache,
          gitdir,
          oid,
          filepath,
        });
      } catch (e) {
        // This means we're resetting the file to a "deleted" state
        oid = null;
      }
    }

    // For files that aren't in the workdir use zeros
    let stats = {
      ctime: new Date(0),
      mtime: new Date(0),
      dev: 0,
      ino: 0,
      mode: 0,
      uid: 0,
      gid: 0,
      size: 0,
    };
    // If the file exists in the workdir...
    const object = dir && (await fs.read(join(dir, filepath)));
    if (object) {
      // ... and has the same hash as the desired state...
      workdirOid = await hashObject$1({
        gitdir,
        type: 'blob',
        object,
      });
      if (oid === workdirOid) {
        // ... use the workdir Stats object
        stats = await fs.lstat(join(dir, filepath));
      }
    }
    await GitIndexManager.acquire({ fs, gitdir, cache }, async function(index) {
      index.delete({ filepath });
      if (oid) {
        index.insert({ filepath, stats, oid });
      }
    });
  } catch (err) {
    err.caller = 'git.reset';
    throw err
  }
}

// @ts-check

/**
 * Get the value of a symbolic ref or resolve a ref to its SHA-1 object id
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - The ref to resolve
 * @param {number} [args.depth = undefined] - How many symbolic references to follow before returning
 *
 * @returns {Promise<string>} Resolves successfully with a SHA-1 object id or the value of a symbolic ref
 *
 * @example
 * let currentCommit = await git.resolveRef({ fs, dir: '/tutorial', ref: 'HEAD' })
 * console.log(currentCommit)
 * let currentBranch = await git.resolveRef({ fs, dir: '/tutorial', ref: 'HEAD', depth: 2 })
 * console.log(currentBranch)
 *
 */
async function resolveRef({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  depth,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);

    const oid = await GitRefManager.resolve({
      fs: new FileSystem(fs),
      gitdir,
      ref,
      depth,
    });
    return oid
  } catch (err) {
    err.caller = 'git.resolveRef';
    throw err
  }
}

// @ts-check

/**
 * Write an entry to the git config files.
 *
 * *Caveats:*
 * - Currently only the local `$GIT_DIR/config` file can be read or written. However support for the global `~/.gitconfig` and system `$(prefix)/etc/gitconfig` will be added in the future.
 * - The current parser does not support the more exotic features of the git-config file format such as `[include]` and `[includeIf]`.
 *
 * @param {Object} args
 * @param {FsClient} args.fs - a file system implementation
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.path - The key of the git config entry
 * @param {string | boolean | number | void} args.value - A value to store at that path. (Use `undefined` as the value to delete a config entry.)
 * @param {boolean} [args.append = false] - If true, will append rather than replace when setting (use with multi-valued config options).
 *
 * @returns {Promise<void>} Resolves successfully when operation completed
 *
 * @example
 * // Write config value
 * await git.setConfig({
 *   fs,
 *   dir: '/tutorial',
 *   path: 'user.name',
 *   value: 'Mr. Test'
 * })
 *
 * // Print out config file
 * let file = await fs.promises.readFile('/tutorial/.git/config', 'utf8')
 * console.log(file)
 *
 * // Delete a config entry
 * await git.setConfig({
 *   fs,
 *   dir: '/tutorial',
 *   path: 'user.name',
 *   value: undefined
 * })
 *
 * // Print out config file
 * file = await fs.promises.readFile('/tutorial/.git/config', 'utf8')
 * console.log(file)
 */
async function setConfig({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  path,
  value,
  append = false,
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('path', path);
    // assertParameter('value', value) // We actually allow 'undefined' as a value to unset/delete

    const fs = new FileSystem(_fs);
    const config = await GitConfigManager.get({ fs, gitdir });
    if (append) {
      await config.append(path, value);
    } else {
      await config.set(path, value);
    }
    await GitConfigManager.save({ fs, gitdir, config });
  } catch (err) {
    err.caller = 'git.setConfig';
    throw err
  }
}

// @ts-check

/**
 * Tell whether a file has been changed
 *
 * The possible resolve values are:
 *
 * | status                | description                                                                           |
 * | --------------------- | ------------------------------------------------------------------------------------- |
 * | `"ignored"`           | file ignored by a .gitignore rule                                                     |
 * | `"unmodified"`        | file unchanged from HEAD commit                                                       |
 * | `"*modified"`         | file has modifications, not yet staged                                                |
 * | `"*deleted"`          | file has been removed, but the removal is not yet staged                              |
 * | `"*added"`            | file is untracked, not yet staged                                                     |
 * | `"absent"`            | file not present in HEAD commit, staging area, or working dir                         |
 * | `"modified"`          | file has modifications, staged                                                        |
 * | `"deleted"`           | file has been removed, staged                                                         |
 * | `"added"`             | previously untracked file, staged                                                     |
 * | `"*unmodified"`       | working dir and HEAD commit match, but index differs                                  |
 * | `"*absent"`           | file not present in working dir or HEAD commit, but present in the index              |
 * | `"*undeleted"`        | file was deleted from the index, but is still in the working dir                      |
 * | `"*undeletemodified"` | file was deleted from the index, but is present with modifications in the working dir |
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} args.dir - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.filepath - The path to the file to query
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<'ignored'|'unmodified'|'*modified'|'*deleted'|'*added'|'absent'|'modified'|'deleted'|'added'|'*unmodified'|'*absent'|'*undeleted'|'*undeletemodified'>} Resolves successfully with the file's git status
 *
 * @example
 * let status = await git.status({ fs, dir: '/tutorial', filepath: 'README.md' })
 * console.log(status)
 *
 */
async function status({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  filepath,
  cache = {},
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('filepath', filepath);

    const fs = new FileSystem(_fs);
    const ignored = await GitIgnoreManager.isIgnored({
      fs,
      gitdir,
      dir,
      filepath,
    });
    if (ignored) {
      return 'ignored'
    }
    const headTree = await getHeadTree({ fs, cache, gitdir });
    const treeOid = await getOidAtPath({
      fs,
      cache,
      gitdir,
      tree: headTree,
      path: filepath,
    });
    const indexEntry = await GitIndexManager.acquire(
      { fs, gitdir, cache },
      async function(index) {
        for (const entry of index) {
          if (entry.path === filepath) return entry
        }
        return null
      }
    );
    const stats = await fs.lstat(join(dir, filepath));

    const H = treeOid !== null; // head
    const I = indexEntry !== null; // index
    const W = stats !== null; // working dir

    const getWorkdirOid = async () => {
      if (I && !compareStats(indexEntry, stats)) {
        return indexEntry.oid
      } else {
        const object = await fs.read(join(dir, filepath));
        const workdirOid = await hashObject$1({
          gitdir,
          type: 'blob',
          object,
        });
        // If the oid in the index === working dir oid but stats differed update cache
        if (I && indexEntry.oid === workdirOid) {
          // and as long as our fs.stats aren't bad.
          // size of -1 happens over a BrowserFS HTTP Backend that doesn't serve Content-Length headers
          // (like the Karma webserver) because BrowserFS HTTP Backend uses HTTP HEAD requests to do fs.stat
          if (stats.size !== -1) {
            // We don't await this so we can return faster for one-off cases.
            GitIndexManager.acquire({ fs, gitdir, cache }, async function(
              index
            ) {
              index.insert({ filepath, stats, oid: workdirOid });
            });
          }
        }
        return workdirOid
      }
    };

    if (!H && !W && !I) return 'absent' // ---
    if (!H && !W && I) return '*absent' // -A-
    if (!H && W && !I) return '*added' // --A
    if (!H && W && I) {
      const workdirOid = await getWorkdirOid();
      // @ts-ignore
      return workdirOid === indexEntry.oid ? 'added' : '*added' // -AA : -AB
    }
    if (H && !W && !I) return 'deleted' // A--
    if (H && !W && I) {
      // @ts-ignore
      return treeOid === indexEntry.oid ? '*deleted' : '*deleted' // AA- : AB-
    }
    if (H && W && !I) {
      const workdirOid = await getWorkdirOid();
      return workdirOid === treeOid ? '*undeleted' : '*undeletemodified' // A-A : A-B
    }
    if (H && W && I) {
      const workdirOid = await getWorkdirOid();
      if (workdirOid === treeOid) {
        // @ts-ignore
        return workdirOid === indexEntry.oid ? 'unmodified' : '*unmodified' // AAA : ABA
      } else {
        // @ts-ignore
        return workdirOid === indexEntry.oid ? 'modified' : '*modified' // ABB : AAB
      }
    }
    /*
    ---
    -A-
    --A
    -AA
    -AB
    A--
    AA-
    AB-
    A-A
    A-B
    AAA
    ABA
    ABB
    AAB
    */
  } catch (err) {
    err.caller = 'git.status';
    throw err
  }
}

async function getOidAtPath({ fs, cache, gitdir, tree, path }) {
  if (typeof path === 'string') path = path.split('/');
  const dirname = path.shift();
  for (const entry of tree) {
    if (entry.path === dirname) {
      if (path.length === 0) {
        return entry.oid
      }
      const { type, object } = await _readObject({
        fs,
        cache,
        gitdir,
        oid: entry.oid,
      });
      if (type === 'tree') {
        const tree = GitTree.from(object);
        return getOidAtPath({ fs, cache, gitdir, tree, path })
      }
      if (type === 'blob') {
        throw new ObjectTypeError(entry.oid, type, 'blob', path.join('/'))
      }
    }
  }
  return null
}

async function getHeadTree({ fs, cache, gitdir }) {
  // Get the tree from the HEAD commit.
  let oid;
  try {
    oid = await GitRefManager.resolve({ fs, gitdir, ref: 'HEAD' });
  } catch (e) {
    // Handle fresh branches with no commits
    if (e instanceof NotFoundError) {
      return []
    }
  }
  const { tree } = await _readTree({ fs, cache, gitdir, oid });
  return tree
}

// @ts-check

/**
 * Efficiently get the status of multiple files at once.
 *
 * The returned `StatusMatrix` is admittedly not the easiest format to read.
 * However it conveys a large amount of information in dense format that should make it easy to create reports about the current state of the repository;
 * without having to do multiple, time-consuming isomorphic-git calls.
 * My hope is that the speed and flexibility of the function will make up for the learning curve of interpreting the return value.
 *
 * ```js live
 * // get the status of all the files in 'src'
 * let status = await git.statusMatrix({
 *   fs,
 *   dir: '/tutorial',
 *   filter: f => f.startsWith('src/')
 * })
 * console.log(status)
 * ```
 *
 * ```js live
 * // get the status of all the JSON and Markdown files
 * let status = await git.statusMatrix({
 *   fs,
 *   dir: '/tutorial',
 *   filter: f => f.endsWith('.json') || f.endsWith('.md')
 * })
 * console.log(status)
 * ```
 *
 * The result is returned as a 2D array.
 * The outer array represents the files and/or blobs in the repo, in alphabetical order.
 * The inner arrays describe the status of the file:
 * the first value is the filepath, and the next three are integers
 * representing the HEAD status, WORKDIR status, and STAGE status of the entry.
 *
 * ```js
 * // example StatusMatrix
 * [
 *   ["a.txt", 0, 2, 0], // new, untracked
 *   ["b.txt", 0, 2, 2], // added, staged
 *   ["c.txt", 0, 2, 3], // added, staged, with unstaged changes
 *   ["d.txt", 1, 1, 1], // unmodified
 *   ["e.txt", 1, 2, 1], // modified, unstaged
 *   ["f.txt", 1, 2, 2], // modified, staged
 *   ["g.txt", 1, 2, 3], // modified, staged, with unstaged changes
 *   ["h.txt", 1, 0, 1], // deleted, unstaged
 *   ["i.txt", 1, 0, 0], // deleted, staged
 * ]
 * ```
 *
 * - The HEAD status is either absent (0) or present (1).
 * - The WORKDIR status is either absent (0), identical to HEAD (1), or different from HEAD (2).
 * - The STAGE status is either absent (0), identical to HEAD (1), identical to WORKDIR (2), or different from WORKDIR (3).
 *
 * ```ts
 * type Filename      = string
 * type HeadStatus    = 0 | 1
 * type WorkdirStatus = 0 | 1 | 2
 * type StageStatus   = 0 | 1 | 2 | 3
 *
 * type StatusRow     = [Filename, HeadStatus, WorkdirStatus, StageStatus]
 *
 * type StatusMatrix  = StatusRow[]
 * ```
 *
 * > Think of the natural progression of file modifications as being from HEAD (previous) -> WORKDIR (current) -> STAGE (next).
 * > Then HEAD is "version 1", WORKDIR is "version 2", and STAGE is "version 3".
 * > Then, imagine a "version 0" which is before the file was created.
 * > Then the status value in each column corresponds to the oldest version of the file it is identical to.
 * > (For a file to be identical to "version 0" means the file is deleted.)
 *
 * Here are some examples of queries you can answer using the result:
 *
 * #### Q: What files have been deleted?
 * ```js
 * const FILE = 0, WORKDIR = 2
 *
 * const filenames = (await statusMatrix({ dir }))
 *   .filter(row => row[WORKDIR] === 0)
 *   .map(row => row[FILE])
 * ```
 *
 * #### Q: What files have unstaged changes?
 * ```js
 * const FILE = 0, WORKDIR = 2, STAGE = 3
 *
 * const filenames = (await statusMatrix({ dir }))
 *   .filter(row => row[WORKDIR] !== row[STAGE])
 *   .map(row => row[FILE])
 * ```
 *
 * #### Q: What files have been modified since the last commit?
 * ```js
 * const FILE = 0, HEAD = 1, WORKDIR = 2
 *
 * const filenames = (await statusMatrix({ dir }))
 *   .filter(row => row[HEAD] !== row[WORKDIR])
 *   .map(row => row[FILE])
 * ```
 *
 * #### Q: What files will NOT be changed if I commit right now?
 * ```js
 * const FILE = 0, HEAD = 1, STAGE = 3
 *
 * const filenames = (await statusMatrix({ dir }))
 *   .filter(row => row[HEAD] === row[STAGE])
 *   .map(row => row[FILE])
 * ```
 *
 * For reference, here are all possible combinations:
 *
 * | HEAD | WORKDIR | STAGE | `git status --short` equivalent |
 * | ---- | ------- | ----- | ------------------------------- |
 * | 0    | 0       | 0     | ``                              |
 * | 0    | 0       | 3     | `AD`                            |
 * | 0    | 2       | 0     | `??`                            |
 * | 0    | 2       | 2     | `A `                            |
 * | 0    | 2       | 3     | `AM`                            |
 * | 1    | 0       | 0     | `D `                            |
 * | 1    | 0       | 1     | ` D`                            |
 * | 1    | 0       | 3     | `MD`                            |
 * | 1    | 1       | 0     | `D ` + `??`                     |
 * | 1    | 1       | 1     | ``                              |
 * | 1    | 1       | 3     | `MM`                            |
 * | 1    | 2       | 0     | `D ` + `??`                     |
 * | 1    | 2       | 1     | ` M`                            |
 * | 1    | 2       | 2     | `M `                            |
 * | 1    | 2       | 3     | `MM`                            |
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} args.dir - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} [args.ref = 'HEAD'] - Optionally specify a different commit to compare against the workdir and stage instead of the HEAD
 * @param {string[]} [args.filepaths = ['.']] - Limit the query to the given files and directories
 * @param {function(string): boolean} [args.filter] - Filter the results to only those whose filepath matches a function.
 * @param {object} [args.cache] - a [cache](cache.md) object
 * @param {boolean} [args.ignored = false] - include ignored files in the result
 *
 * @returns {Promise<Array<StatusRow>>} Resolves with a status matrix, described below.
 * @see StatusRow
 */
async function statusMatrix({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  ref = 'HEAD',
  filepaths = ['.'],
  filter,
  cache = {},
  ignored: shouldIgnore = false,
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);

    const fs = new FileSystem(_fs);
    return await _walk({
      fs,
      cache,
      dir,
      gitdir,
      trees: [TREE({ ref }), WORKDIR(), STAGE()],
      map: async function(filepath, [head, workdir, stage]) {
        // Ignore ignored files, but only if they are not already tracked.
        if (!head && !stage && workdir) {
          if (!shouldIgnore) {
            const isIgnored = await GitIgnoreManager.isIgnored({
              fs,
              dir,
              filepath,
            });
            if (isIgnored) {
              return null
            }
          }
        }
        // match against base paths
        if (!filepaths.some(base => worthWalking(filepath, base))) {
          return null
        }
        // Late filter against file names
        if (filter) {
          if (!filter(filepath)) return
        }

        const [headType, workdirType, stageType] = await Promise.all([
          head && head.type(),
          workdir && workdir.type(),
          stage && stage.type(),
        ]);

        const isBlob = [headType, workdirType, stageType].includes('blob');

        // For now, bail on directories unless the file is also a blob in another tree
        if ((headType === 'tree' || headType === 'special') && !isBlob) return
        if (headType === 'commit') return null

        if ((workdirType === 'tree' || workdirType === 'special') && !isBlob)
          return

        if (stageType === 'commit') return null
        if ((stageType === 'tree' || stageType === 'special') && !isBlob) return

        // Figure out the oids for files, using the staged oid for the working dir oid if the stats match.
        const headOid = headType === 'blob' ? await head.oid() : undefined;
        const stageOid = stageType === 'blob' ? await stage.oid() : undefined;
        let workdirOid;
        if (
          headType !== 'blob' &&
          workdirType === 'blob' &&
          stageType !== 'blob'
        ) {
          // We don't actually NEED the sha. Any sha will do
          // TODO: update this logic to handle N trees instead of just 3.
          workdirOid = '42';
        } else if (workdirType === 'blob') {
          workdirOid = await workdir.oid();
        }
        const entry = [undefined, headOid, workdirOid, stageOid];
        const result = entry.map(value => entry.indexOf(value));
        result.shift(); // remove leading undefined entry
        return [filepath, ...result]
      },
    })
  } catch (err) {
    err.caller = 'git.statusMatrix';
    throw err
  }
}

// @ts-check

/**
 * Create a lightweight tag
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - What to name the tag
 * @param {string} [args.object = 'HEAD'] - What oid the tag refers to. (Will resolve to oid if value is a ref.) By default, the commit object which is referred by the current `HEAD` is used.
 * @param {boolean} [args.force = false] - Instead of throwing an error if a tag named `ref` already exists, overwrite the existing tag.
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.tag({ fs, dir: '/tutorial', ref: 'test-tag' })
 * console.log('done')
 *
 */
async function tag({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  object,
  force = false,
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);

    const fs = new FileSystem(_fs);

    if (ref === undefined) {
      throw new MissingParameterError('ref')
    }

    ref = ref.startsWith('refs/tags/') ? ref : `refs/tags/${ref}`;

    // Resolve passed object
    const value = await GitRefManager.resolve({
      fs,
      gitdir,
      ref: object || 'HEAD',
    });

    if (!force && (await GitRefManager.exists({ fs, gitdir, ref }))) {
      throw new AlreadyExistsError('tag', ref)
    }

    await GitRefManager.writeRef({ fs, gitdir, ref, value });
  } catch (err) {
    err.caller = 'git.tag';
    throw err
  }
}

// @ts-check

/**
 * Register file contents in the working tree or object database to the git index (aka staging area).
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} args.dir - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir, '.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.filepath - File to act upon.
 * @param {string} [args.oid] - OID of the object in the object database to add to the index with the specified filepath.
 * @param {number} [args.mode = 100644] - The file mode to add the file to the index.
 * @param {boolean} [args.add] - Adds the specified file to the index if it does not yet exist in the index.
 * @param {boolean} [args.remove] - Remove the specified file from the index if it does not exist in the workspace anymore.
 * @param {boolean} [args.force] - Remove the specified file from the index, even if it still exists in the workspace.
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<string | void>} Resolves successfully with the SHA-1 object id of the object written or updated in the index, or nothing if the file was removed.
 *
 * @example
 * await git.updateIndex({
 *   fs,
 *   dir: '/tutorial',
 *   filepath: 'readme.md'
 * })
 *
 * @example
 * // Manually create a blob in the object database.
 * let oid = await git.writeBlob({
 *   fs,
 *   dir: '/tutorial',
 *   blob: new Uint8Array([])
 * })
 *
 * // Write the object in the object database to the index.
 * await git.updateIndex({
 *   fs,
 *   dir: '/tutorial',
 *   add: true,
 *   filepath: 'readme.md',
 *   oid
 * })
 */
async function updateIndex({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  cache = {},
  filepath,
  oid,
  mode,
  add,
  remove,
  force,
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('filepath', filepath);

    const fs = new FileSystem(_fs);

    if (remove) {
      return await GitIndexManager.acquire(
        { fs, gitdir, cache },
        async function(index) {
          let fileStats;

          if (!force) {
            // Check if the file is still present in the working directory
            fileStats = await fs.lstat(join(dir, filepath));

            if (fileStats) {
              if (fileStats.isDirectory()) {
                // Removing directories should not work
                throw new InvalidFilepathError('directory')
              }

              // Do nothing if we don't force and the file still exists in the workdir
              return
            }
          }

          // Directories are not allowed, so we make sure the provided filepath exists in the index
          if (index.has({ filepath })) {
            index.delete({
              filepath,
            });
          }
        }
      )
    }

    // Test if it is a file and exists on disk if `remove` is not provided, only of no oid is provided
    let fileStats;

    if (!oid) {
      fileStats = await fs.lstat(join(dir, filepath));

      if (!fileStats) {
        throw new NotFoundError(
          `file at "${filepath}" on disk and "remove" not set`
        )
      }

      if (fileStats.isDirectory()) {
        throw new InvalidFilepathError('directory')
      }
    }

    return await GitIndexManager.acquire({ fs, gitdir, cache }, async function(
      index
    ) {
      if (!add && !index.has({ filepath })) {
        // If the index does not contain the filepath yet and `add` is not set, we should throw
        throw new NotFoundError(
          `file at "${filepath}" in index and "add" not set`
        )
      }

      // By default we use 0 for the stats of the index file
      let stats = {
        ctime: new Date(0),
        mtime: new Date(0),
        dev: 0,
        ino: 0,
        mode,
        uid: 0,
        gid: 0,
        size: 0,
      };

      if (!oid) {
        stats = fileStats;

        // Write the file to the object database
        const object = stats.isSymbolicLink()
          ? await fs.readlink(join(dir, filepath))
          : await fs.read(join(dir, filepath));

        oid = await _writeObject({
          fs,
          gitdir,
          type: 'blob',
          format: 'content',
          object,
        });
      }

      index.insert({
        filepath,
        oid: oid,
        stats,
      });

      return oid
    })
  } catch (err) {
    err.caller = 'git.updateIndex';
    throw err
  }
}

// @ts-check

/**
 * Return the version number of isomorphic-git
 *
 * I don't know why you might need this. I added it just so I could check that I was getting
 * the correct version of the library and not a cached version.
 *
 * @returns {string} the version string taken from package.json at publication time
 *
 * @example
 * console.log(git.version())
 *
 */
function version() {
  try {
    return pkg.version
  } catch (err) {
    err.caller = 'git.version';
    throw err
  }
}

// @ts-check

/**
 * @callback WalkerMap
 * @param {string} filename
 * @param {Array<WalkerEntry | null>} entries
 * @returns {Promise<any>}
 */

/**
 * @callback WalkerReduce
 * @param {any} parent
 * @param {any[]} children
 * @returns {Promise<any>}
 */

/**
 * @callback WalkerIterateCallback
 * @param {WalkerEntry[]} entries
 * @returns {Promise<any[]>}
 */

/**
 * @callback WalkerIterate
 * @param {WalkerIterateCallback} walk
 * @param {IterableIterator<WalkerEntry[]>} children
 * @returns {Promise<any[]>}
 */

/**
 * A powerful recursive tree-walking utility.
 *
 * The `walk` API simplifies gathering detailed information about a tree or comparing all the filepaths in two or more trees.
 * Trees can be git commits, the working directory, or the or git index (staging area).
 * As long as a file or directory is present in at least one of the trees, it will be traversed.
 * Entries are traversed in alphabetical order.
 *
 * The arguments to `walk` are the `trees` you want to traverse, and 3 optional transform functions:
 *  `map`, `reduce`, and `iterate`.
 *
 * ## `TREE`, `WORKDIR`, and `STAGE`
 *
 * Tree walkers are represented by three separate functions that can be imported:
 *
 * ```js
 * import { TREE, WORKDIR, STAGE } from 'isomorphic-git'
 * ```
 *
 * These functions return opaque handles called `Walker`s.
 * The only thing that `Walker` objects are good for is passing into `walk`.
 * Here are the three `Walker`s passed into `walk` by the `statusMatrix` command for example:
 *
 * ```js
 * let ref = 'HEAD'
 *
 * let trees = [TREE({ ref }), WORKDIR(), STAGE()]
 * ```
 *
 * For the arguments, see the doc pages for [TREE](./TREE.md), [WORKDIR](./WORKDIR.md), and [STAGE](./STAGE.md).
 *
 * `map`, `reduce`, and `iterate` allow you control the recursive walk by pruning and transforming `WalkerEntry`s into the desired result.
 *
 * ## WalkerEntry
 *
 * {@link WalkerEntry typedef}
 *
 * `map` receives an array of `WalkerEntry[]` as its main argument, one `WalkerEntry` for each `Walker` in the `trees` argument.
 * The methods are memoized per `WalkerEntry` so calling them multiple times in a `map` function does not adversely impact performance.
 * By only computing these values if needed, you build can build lean, mean, efficient walking machines.
 *
 * ### WalkerEntry#type()
 *
 * Returns the kind as a string. This is normally either `tree` or `blob`.
 *
 * `TREE`, `STAGE`, and `WORKDIR` walkers all return a string.
 *
 * Possible values:
 *
 * - `'tree'` directory
 * - `'blob'` file
 * - `'special'` used by `WORKDIR` to represent irregular files like sockets and FIFOs
 * - `'commit'` used by `TREE` to represent submodules
 *
 * ```js
 * await entry.type()
 * ```
 *
 * ### WalkerEntry#mode()
 *
 * Returns the file mode as a number. Use this to distinguish between regular files, symlinks, and executable files.
 *
 * `TREE`, `STAGE`, and `WORKDIR` walkers all return a number for all `type`s of entries.
 *
 * It has been normalized to one of the 4 values that are allowed in git commits:
 *
 * - `0o40000` directory
 * - `0o100644` file
 * - `0o100755` file (executable)
 * - `0o120000` symlink
 *
 * Tip: to make modes more readable, you can print them to octal using `.toString(8)`.
 *
 * ```js
 * await entry.mode()
 * ```
 *
 * ### WalkerEntry#oid()
 *
 * Returns the SHA-1 object id for blobs and trees.
 *
 * `TREE` walkers return a string for `blob` and `tree` entries.
 *
 * `STAGE` and `WORKDIR` walkers return a string for `blob` entries and `undefined` for `tree` entries.
 *
 * ```js
 * await entry.oid()
 * ```
 *
 * ### WalkerEntry#content()
 *
 * Returns the file contents as a Buffer.
 *
 * `TREE` and `WORKDIR` walkers return a Buffer for `blob` entries and `undefined` for `tree` entries.
 *
 * `STAGE` walkers always return `undefined` since the file contents are never stored in the stage.
 *
 * ```js
 * await entry.content()
 * ```
 *
 * ### WalkerEntry#stat()
 *
 * Returns a normalized subset of filesystem Stat data.
 *
 * `WORKDIR` walkers return a `Stat` for `blob` and `tree` entries.
 *
 * `STAGE` walkers return a `Stat` for `blob` entries and `undefined` for `tree` entries.
 *
 * `TREE` walkers return `undefined` for all entry types.
 *
 * ```js
 * await entry.stat()
 * ```
 *
 * {@link Stat typedef}
 *
 * ## map(string, Array<WalkerEntry|null>) => Promise<any>
 *
 * {@link WalkerMap typedef}
 *
 * This is the function that is called once per entry BEFORE visiting the children of that node.
 *
 * If you return `null` for a `tree` entry, then none of the children of that `tree` entry will be walked.
 *
 * This is a good place for query logic, such as examining the contents of a file.
 * Ultimately, compare all the entries and return any values you are interested in.
 * If you do not return a value (or return undefined) that entry will be filtered from the results.
 *
 * Example 1: Find all the files containing the word 'foo'.
 * ```js
 * async function map(filepath, [head, workdir]) {
 *   let content = (await workdir.content()).toString('utf8')
 *   if (content.contains('foo')) {
 *     return {
 *       filepath,
 *       content
 *     }
 *   }
 * }
 * ```
 *
 * Example 2: Return the difference between the working directory and the HEAD commit
 * ```js
 * const map = async (filepath, [head, workdir]) => {
 *   return {
 *     filepath,
 *     oid: await head?.oid(),
 *     diff: diff(
 *       (await head?.content())?.toString('utf8') || '',
 *       (await workdir?.content())?.toString('utf8') || ''
 *     )
 *   }
 * }
 * ```
 *
 * Example 3:
 * ```js
 * let path = require('path')
 * // Only examine files in the directory `cwd`
 * let cwd = 'src/app'
 * async function map (filepath, [head, workdir, stage]) {
 *   if (
 *     // don't skip the root directory
 *     head.fullpath !== '.' &&
 *     // return true for 'src' and 'src/app'
 *     !cwd.startsWith(filepath) &&
 *     // return true for 'src/app/*'
 *     path.dirname(filepath) !== cwd
 *   ) {
 *     return null
 *   } else {
 *     return filepath
 *   }
 * }
 * ```
 *
 * ## reduce(parent, children)
 *
 * {@link WalkerReduce typedef}
 *
 * This is the function that is called once per entry AFTER visiting the children of that node.
 *
 * Default: `async (parent, children) => parent === undefined ? children.flat() : [parent, children].flat()`
 *
 * The default implementation of this function returns all directories and children in a giant flat array.
 * You can define a different accumulation method though.
 *
 * Example: Return a hierarchical structure
 * ```js
 * async function reduce (parent, children) {
 *   return Object.assign(parent, { children })
 * }
 * ```
 *
 * ## iterate(walk, children)
 *
 * {@link WalkerIterate typedef}
 *
 * {@link WalkerIterateCallback typedef}
 *
 * Default: `(walk, children) => Promise.all([...children].map(walk))`
 *
 * The default implementation recurses all children concurrently using Promise.all.
 * However you could use a custom function to traverse children serially or use a global queue to throttle recursion.
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {Walker[]} args.trees - The trees you want to traverse
 * @param {WalkerMap} [args.map] - Transform `WalkerEntry`s into a result form
 * @param {WalkerReduce} [args.reduce] - Control how mapped entries are combined with their parent result
 * @param {WalkerIterate} [args.iterate] - Fine-tune how entries within a tree are iterated over
 * @param {object} [args.cache] - a [cache](cache.md) object
 *
 * @returns {Promise<any>} The finished tree-walking result
 */
async function walk({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  trees,
  map,
  reduce,
  iterate,
  cache = {},
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('trees', trees);

    return await _walk({
      fs: new FileSystem(fs),
      cache,
      dir,
      gitdir,
      trees,
      map,
      reduce,
      iterate,
    })
  } catch (err) {
    err.caller = 'git.walk';
    throw err
  }
}

// @ts-check

/**
 * Write a blob object directly
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {Uint8Array} args.blob - The blob object to write
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the newly written object
 *
 * @example
 * // Manually create a blob.
 * let oid = await git.writeBlob({
 *   fs,
 *   dir: '/tutorial',
 *   blob: new Uint8Array([])
 * })
 *
 * console.log('oid', oid) // should be 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391'
 *
 */
async function writeBlob({ fs, dir, gitdir = join(dir, '.git'), blob }) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('blob', blob);

    return await _writeObject({
      fs: new FileSystem(fs),
      gitdir,
      type: 'blob',
      object: blob,
      format: 'content',
    })
  } catch (err) {
    err.caller = 'git.writeBlob';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {CommitObject} args.commit
 *
 * @returns {Promise<string>}
 * @see CommitObject
 *
 */
async function _writeCommit({ fs, gitdir, commit }) {
  // Convert object to buffer
  const object = GitCommit.from(commit).toObject();
  const oid = await _writeObject({
    fs,
    gitdir,
    type: 'commit',
    object,
    format: 'content',
  });
  return oid
}

// @ts-check

/**
 * Write a commit object directly
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {CommitObject} args.commit - The object to write
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the newly written object
 * @see CommitObject
 *
 */
async function writeCommit({
  fs,
  dir,
  gitdir = join(dir, '.git'),
  commit,
}) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('commit', commit);

    return await _writeCommit({
      fs: new FileSystem(fs),
      gitdir,
      commit,
    })
  } catch (err) {
    err.caller = 'git.writeCommit';
    throw err
  }
}

// @ts-check

/**
 * Write a git object directly
 *
 * `format` can have the following values:
 *
 * | param      | description                                                                                                                                                      |
 * | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 * | 'deflated' | Treat `object` as the raw deflate-compressed buffer for an object, meaning can be written to `.git/objects/**` as-is.                                           |
 * | 'wrapped'  | Treat `object` as the inflated object buffer wrapped in the git object header. This is the raw buffer used when calculating the SHA-1 object id of a git object. |
 * | 'content'  | Treat `object` as the object buffer without the git header.                                                                                                      |
 * | 'parsed'   | Treat `object` as a parsed representation of the object.                                                                                                         |
 *
 * If `format` is `'parsed'`, then `object` must match one of the schemas for `CommitObject`, `TreeObject`, `TagObject`, or a `string` (for blobs).
 *
 * {@link CommitObject typedef}
 *
 * {@link TreeObject typedef}
 *
 * {@link TagObject typedef}
 *
 * If `format` is `'content'`, `'wrapped'`, or `'deflated'`, `object` should be a `Uint8Array`.
 *
 * @deprecated
 * > This command is overly complicated.
 * >
 * > If you know the type of object you are writing, use [`writeBlob`](./writeBlob.md), [`writeCommit`](./writeCommit.md), [`writeTag`](./writeTag.md), or [`writeTree`](./writeTree.md).
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string | Uint8Array | CommitObject | TreeObject | TagObject} args.object - The object to write.
 * @param {'blob'|'tree'|'commit'|'tag'} [args.type] - The kind of object to write.
 * @param {'deflated' | 'wrapped' | 'content' | 'parsed'} [args.format = 'parsed'] - What format the object is in. The possible choices are listed below.
 * @param {string} [args.oid] - If `format` is `'deflated'` then this param is required. Otherwise it is calculated.
 * @param {string} [args.encoding] - If `type` is `'blob'` then `object` will be converted to a Uint8Array using `encoding`.
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the newly written object.
 *
 * @example
 * // Manually create an annotated tag.
 * let sha = await git.resolveRef({ fs, dir: '/tutorial', ref: 'HEAD' })
 * console.log('commit', sha)
 *
 * let oid = await git.writeObject({
 *   fs,
 *   dir: '/tutorial',
 *   type: 'tag',
 *   object: {
 *     object: sha,
 *     type: 'commit',
 *     tag: 'my-tag',
 *     tagger: {
 *       name: 'your name',
 *       email: 'email@example.com',
 *       timestamp: Math.floor(Date.now()/1000),
 *       timezoneOffset: new Date().getTimezoneOffset()
 *     },
 *     message: 'Optional message'
 *   }
 * })
 *
 * console.log('tag', oid)
 *
 */
async function writeObject({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  type,
  object,
  format = 'parsed',
  oid,
  encoding = undefined,
}) {
  try {
    const fs = new FileSystem(_fs);
    // Convert object to buffer
    if (format === 'parsed') {
      switch (type) {
        case 'commit':
          object = GitCommit.from(object).toObject();
          break
        case 'tree':
          object = GitTree.from(object).toObject();
          break
        case 'blob':
          object = Buffer.from(object, encoding);
          break
        case 'tag':
          object = GitAnnotatedTag.from(object).toObject();
          break
        default:
          throw new ObjectTypeError(oid || '', type, 'blob|commit|tag|tree')
      }
      // GitObjectManager does not know how to serialize content, so we tweak that parameter before passing it.
      format = 'content';
    }
    oid = await _writeObject({
      fs,
      gitdir,
      type,
      object,
      oid,
      format,
    });
    return oid
  } catch (err) {
    err.caller = 'git.writeObject';
    throw err
  }
}

// @ts-check

/**
 * Write a ref which refers to the specified SHA-1 object id, or a symbolic ref which refers to the specified ref.
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {string} args.ref - The name of the ref to write
 * @param {string} args.value - When `symbolic` is false, a ref or an SHA-1 object id. When true, a ref starting with `refs/`.
 * @param {boolean} [args.force = false] - Instead of throwing an error if a ref named `ref` already exists, overwrite the existing ref.
 * @param {boolean} [args.symbolic = false] - Whether the ref is symbolic or not.
 *
 * @returns {Promise<void>} Resolves successfully when filesystem operations are complete
 *
 * @example
 * await git.writeRef({
 *   fs,
 *   dir: '/tutorial',
 *   ref: 'refs/heads/another-branch',
 *   value: 'HEAD'
 * })
 * await git.writeRef({
 *   fs,
 *   dir: '/tutorial',
 *   ref: 'HEAD',
 *   value: 'refs/heads/another-branch',
 *   force: true,
 *   symbolic: true
 * })
 * console.log('done')
 *
 */
async function writeRef({
  fs: _fs,
  dir,
  gitdir = join(dir, '.git'),
  ref,
  value,
  force = false,
  symbolic = false,
}) {
  try {
    assertParameter('fs', _fs);
    assertParameter('gitdir', gitdir);
    assertParameter('ref', ref);
    assertParameter('value', value);

    const fs = new FileSystem(_fs);

    if (ref !== cleanGitRef.clean(ref)) {
      throw new InvalidRefNameError(ref, cleanGitRef.clean(ref))
    }

    if (!force && (await GitRefManager.exists({ fs, gitdir, ref }))) {
      throw new AlreadyExistsError('ref', ref)
    }

    if (symbolic) {
      await GitRefManager.writeSymbolicRef({
        fs,
        gitdir,
        ref,
        value,
      });
    } else {
      value = await GitRefManager.resolve({
        fs,
        gitdir,
        ref: value,
      });
      await GitRefManager.writeRef({
        fs,
        gitdir,
        ref,
        value,
      });
    }
  } catch (err) {
    err.caller = 'git.writeRef';
    throw err
  }
}

// @ts-check

/**
 * @param {object} args
 * @param {import('../models/FileSystem.js').FileSystem} args.fs
 * @param {string} args.gitdir
 * @param {TagObject} args.tag
 *
 * @returns {Promise<string>}
 */
async function _writeTag({ fs, gitdir, tag }) {
  // Convert object to buffer
  const object = GitAnnotatedTag.from(tag).toObject();
  const oid = await _writeObject({
    fs,
    gitdir,
    type: 'tag',
    object,
    format: 'content',
  });
  return oid
}

// @ts-check

/**
 * Write an annotated tag object directly
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {TagObject} args.tag - The object to write
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the newly written object
 * @see TagObject
 *
 * @example
 * // Manually create an annotated tag.
 * let sha = await git.resolveRef({ fs, dir: '/tutorial', ref: 'HEAD' })
 * console.log('commit', sha)
 *
 * let oid = await git.writeTag({
 *   fs,
 *   dir: '/tutorial',
 *   tag: {
 *     object: sha,
 *     type: 'commit',
 *     tag: 'my-tag',
 *     tagger: {
 *       name: 'your name',
 *       email: 'email@example.com',
 *       timestamp: Math.floor(Date.now()/1000),
 *       timezoneOffset: new Date().getTimezoneOffset()
 *     },
 *     message: 'Optional message'
 *   }
 * })
 *
 * console.log('tag', oid)
 *
 */
async function writeTag({ fs, dir, gitdir = join(dir, '.git'), tag }) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('tag', tag);

    return await _writeTag({
      fs: new FileSystem(fs),
      gitdir,
      tag,
    })
  } catch (err) {
    err.caller = 'git.writeTag';
    throw err
  }
}

// @ts-check

/**
 * Write a tree object directly
 *
 * @param {object} args
 * @param {FsClient} args.fs - a file system client
 * @param {string} [args.dir] - The [working tree](dir-vs-gitdir.md) directory path
 * @param {string} [args.gitdir=join(dir,'.git')] - [required] The [git directory](dir-vs-gitdir.md) path
 * @param {TreeObject} args.tree - The object to write
 *
 * @returns {Promise<string>} Resolves successfully with the SHA-1 object id of the newly written object.
 * @see TreeObject
 * @see TreeEntry
 *
 */
async function writeTree({ fs, dir, gitdir = join(dir, '.git'), tree }) {
  try {
    assertParameter('fs', fs);
    assertParameter('gitdir', gitdir);
    assertParameter('tree', tree);

    return await _writeTree({
      fs: new FileSystem(fs),
      gitdir,
      tree,
    })
  } catch (err) {
    err.caller = 'git.writeTree';
    throw err
  }
}

// default export
var index = {
  Errors,
  STAGE,
  TREE,
  WORKDIR,
  add,
  addNote,
  addRemote,
  annotatedTag,
  branch,
  checkout,
  clone,
  commit,
  getConfig,
  getConfigAll,
  setConfig,
  currentBranch,
  deleteBranch,
  deleteRef,
  deleteRemote,
  deleteTag,
  expandOid,
  expandRef,
  fastForward,
  fetch,
  findMergeBase,
  findRoot,
  getRemoteInfo,
  getRemoteInfo2,
  hashBlob,
  indexPack,
  init,
  isDescendent,
  isIgnored,
  listBranches,
  listFiles,
  listNotes,
  listRemotes,
  listServerRefs,
  listTags,
  log,
  merge,
  packObjects,
  pull,
  push,
  readBlob,
  readCommit,
  readNote,
  readObject,
  readTag,
  readTree,
  remove,
  removeNote,
  renameBranch,
  resetIndex,
  updateIndex,
  resolveRef,
  status,
  statusMatrix,
  tag,
  version,
  walk,
  writeBlob,
  writeCommit,
  writeObject,
  writeRef,
  writeTag,
  writeTree,
};

exports.Errors = Errors;
exports.STAGE = STAGE;
exports.TREE = TREE;
exports.WORKDIR = WORKDIR;
exports.add = add;
exports.addNote = addNote;
exports.addRemote = addRemote;
exports.annotatedTag = annotatedTag;
exports.branch = branch;
exports.checkout = checkout;
exports.clone = clone;
exports.commit = commit;
exports.currentBranch = currentBranch;
exports["default"] = index;
exports.deleteBranch = deleteBranch;
exports.deleteRef = deleteRef;
exports.deleteRemote = deleteRemote;
exports.deleteTag = deleteTag;
exports.expandOid = expandOid;
exports.expandRef = expandRef;
exports.fastForward = fastForward;
exports.fetch = fetch;
exports.findMergeBase = findMergeBase;
exports.findRoot = findRoot;
exports.getConfig = getConfig;
exports.getConfigAll = getConfigAll;
exports.getRemoteInfo = getRemoteInfo;
exports.getRemoteInfo2 = getRemoteInfo2;
exports.hashBlob = hashBlob;
exports.indexPack = indexPack;
exports.init = init;
exports.isDescendent = isDescendent;
exports.isIgnored = isIgnored;
exports.listBranches = listBranches;
exports.listFiles = listFiles;
exports.listNotes = listNotes;
exports.listRemotes = listRemotes;
exports.listServerRefs = listServerRefs;
exports.listTags = listTags;
exports.log = log;
exports.merge = merge;
exports.packObjects = packObjects;
exports.pull = pull;
exports.push = push;
exports.readBlob = readBlob;
exports.readCommit = readCommit;
exports.readNote = readNote;
exports.readObject = readObject;
exports.readTag = readTag;
exports.readTree = readTree;
exports.remove = remove;
exports.removeNote = removeNote;
exports.renameBranch = renameBranch;
exports.resetIndex = resetIndex;
exports.resolveRef = resolveRef;
exports.setConfig = setConfig;
exports.status = status;
exports.statusMatrix = statusMatrix;
exports.tag = tag;
exports.updateIndex = updateIndex;
exports.version = version;
exports.walk = walk;
exports.writeBlob = writeBlob;
exports.writeCommit = writeCommit;
exports.writeObject = writeObject;
exports.writeRef = writeRef;
exports.writeTag = writeTag;
exports.writeTree = writeTree;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(2186);
const path = __nccwpck_require__(1017);
const git = __nccwpck_require__(5114);
const fs = __nccwpck_require__(7147);
const glob = __nccwpck_require__(1957);

const
  isAdded = '*added',
  isModified = '*modified',
  isDeleted = '*deleted',
  isOpsSymbol = {
    [isAdded]: '+',
    [isModified]: '*',
    [isDeleted]: '-',
  };

function translationSortAndFill(translationObject, translationPrefix) {
  const sortedTranslation = {};
  Object.keys(translationObject).sort().forEach(translationId => {
    const currentId = translationPrefix ? [translationPrefix, translationId].join('.') : translationId;
    if (typeof translationObject[translationId] === 'object') {
      sortedTranslation[translationId] = translationSortAndFill(translationObject[translationId], currentId);
    }
    else {
      sortedTranslation[translationId] = translationObject[translationId] ? translationObject[translationId] : currentId;
    }
  });
  return sortedTranslation;
}

function translationToPlain(translationObject, translationPrefix) {
  const translationPlain = {};
  Object.keys(translationObject).forEach(translationId => {
    const currentId = translationPrefix ? [translationPrefix, translationId].join('.') : translationId;
    if (typeof translationObject[translationId] === 'object') {
      const inheritedPlain = translationToPlain(translationObject[translationId], translationId);
      Object.keys(inheritedPlain).forEach(inheritedTranslationId => {
        translationPlain[inheritedTranslationId] = inheritedPlain[inheritedTranslationId];
      });
    }
    else {
      translationPlain[currentId] = translationObject[translationId];
    }
  });
  return translationPlain;
}

// most @actions toolkit packages have async methods
async function run() {
  const dir = process.cwd();
  const foldersToAddToGit = {};
  try {
    let
      sourceTranslationsPattern, transformedTranslationsRelativePathAndPattern;
    try {
      sourceTranslationsPattern = core.getInput('source_translations_pattern', { required: true });
      try {
        transformedTranslationsRelativePathAndPattern = core.getInput('transformed_translations_relative_path_and_pattern', { required: true });
        let gitUserName = core.getInput('git_user_name');
        if (! gitUserName) gitUserName = 'github-actions';
        let gitUserMail = core.getInput('git_user_mail');
        if (! gitUserMail) gitUserMail = 'github-actions@github.com';
        let isDryRun = core.getInput('dry_run');
        if ((! isDryRun) || (isDryRun !== 'true')) {
          isDryRun = false;
        }
        else {
          isDryRun = true;
        }
        console.log(`Source translations pattern = ${sourceTranslationsPattern}!`);
        console.log(`Transformed translation pattern =  ${transformedTranslationsRelativePathAndPattern}!`);
        const sourceFileRegExp = new RegExp(path.basename(sourceTranslationsPattern).replace(/\?/g,'.'));
        sourceTranslationsPattern = sourceTranslationsPattern.replace(/[()]/g, '');
        const
          transformedTranslationsRelativePath = path.dirname(transformedTranslationsRelativePathAndPattern),
          transformedTranslationsPattern = path.basename(transformedTranslationsRelativePathAndPattern);
        const sourceFilesArray = glob.sync(sourceTranslationsPattern);
        if (sourceFilesArray && sourceFilesArray.length) {
          for (const sourceFullPath of sourceFilesArray) {
            const
              sourceFolder = path.dirname(sourceFullPath),
              sourceFileName = path.basename(sourceFullPath),
              sourceFileMask = sourceFileRegExp.exec(sourceFileName);
            if (sourceFileMask && (sourceFileMask.length === 2) && sourceFileMask[1]) {
              const
                translationLanguageId = sourceFileMask[1],
                transformedFolder = path.join(sourceFolder, transformedTranslationsRelativePath),
                transformedFileName = transformedTranslationsPattern.replace('$language$', translationLanguageId),
                transformedFullPath= path.join(transformedFolder, transformedFileName),
                sourceFileStatus = await git.status({ fs, dir, filepath: sourceFullPath });
                console.log(`${sourceFullPath} status = ${sourceFileStatus}`);
                if ((!fs.existsSync(transformedFullPath)) || ([isAdded, isModified].includes(sourceFileStatus))) {
                  console.log(`File to create/update: '${transformedFullPath}'`);
                  const transformedFileStatus = fs.existsSync(transformedFullPath) ? isModified : isAdded;
                  try {
                    const translationSourceRaw = fs.readFileSync(sourceFullPath);
                    try {
                      const translationSource = JSON.parse(translationSourceRaw);
                      if ((typeof translationSource === 'object') && Object.keys(translationSource).length) {
                        const
                          translationSorted = translationSortAndFill(translationSource, ''),
                          translationTransformed = {
                            type: 'telegramMenuTranslation',
                            language: translationLanguageId,
                            version: '1.0',
                            translation: translationSorted
                          },
                          translationTransformedJSON = JSON.stringify(translationTransformed, null, 2),
                          changedKeys = {};
                        if (fs.existsSync(transformedFullPath)) {
                          const transformedOldRaw = fs.readFileSync(transformedFullPath);
                          try {
                            const translationOld = JSON.parse(transformedOldRaw);
                            if (translationOld && translationOld.hasOwnProperty('translation')) {
                              const
                                translationOldPlain = translationToPlain(translationOld['translation'], ''),
                                translationPlain = translationToPlain(translationSorted, '');
                              Object.keys(translationOldPlain).forEach(key => {
                                if (translationPlain.hasOwnProperty(key) && (translationOldPlain[key] !== translationPlain[key])) {
                                  changedKeys[key] = isModified;
                                }
                                else if (! translationPlain.hasOwnProperty(key)) {
                                  changedKeys[key] = isDeleted;
                                }
                              });
                              Object.keys(translationPlain).forEach(key => {
                                if (! translationOldPlain.hasOwnProperty(key)) {
                                  changedKeys[key] = isAdded;
                                }
                              });
                            }
                          }
                          catch (error) {
                            core.error(`Can't parse old core file '${transformedFullPath}'. Error is ${JSON.stringify(error)}.`);
                          }
                        }
                        try {
                          fs.writeFileSync(transformedFullPath, translationTransformedJSON);
                          console.log(`Transformed translation file '${transformedFullPath}' is created/updated.`);
                          if (! foldersToAddToGit.hasOwnProperty(sourceFolder)) foldersToAddToGit[sourceFolder] = {};
                          foldersToAddToGit[sourceFolder][translationLanguageId] = {
                            source: {path: sourceFullPath, status: sourceFileStatus},
                            transformed: {path: transformedFullPath, status: transformedFileStatus},
                            changedKeys: changedKeys
                          };
                        }
                        catch (error) {
                          core.error(`Can't write to file '${transformedFullPath}'`);
                        }
                      }
                      else {
                        core.warning(`File '${sourceFileStatus}' has no data!`);
                      }
                    }
                    catch (error) {
                      core.error(`Can't parse file '${sourceFileStatus}'. Error is ${JSON.stringify(error)}.`);
                    }
                  }
                  catch (error) {
                    core.error(`Can't read file '${sourceFileStatus}'`);
                  }
                }
            }
          }
        }
        if (Object.keys(foldersToAddToGit).length) {
          try {
            let message = `Update of locale files by pattern ${sourceTranslationsPattern}.`;
            for (const [gitFolderToAdd, currentLanguages] of Object.entries(foldersToAddToGit)) {
              message += `\n In folder ${gitFolderToAdd} for languages: ${Object.keys(currentLanguages).join(', ')}`;
              for (const [languageId, currentLanguage] of Object.entries(currentLanguages)) {
                message += `\n  ${currentLanguage.source === isAdded &&  currentLanguage.core === isAdded ? '+' : '*'} Language '${languageId}':`;
                message += `\n   Changes in files:`;
                message += `\n    ${isOpsSymbol[currentLanguage.source.status]} ${currentLanguage.source.path},`;
                message += `\n    ${isOpsSymbol[currentLanguage.transformed.status]} ${currentLanguage.transformed.path}.`;
                const changedKeys = currentLanguage.changedKeys;
                if (changedKeys && Object.keys(changedKeys).length) {
                  message += `\n   Changes in translation keys:`;
                  const lastIndex = Object.keys(changedKeys).length - 1;
                  Object.keys(changedKeys).sort().forEach((key, index) => {
                    message += `\n    ${isOpsSymbol[changedKeys[key]]} ${key}${index === lastIndex ? '.' : ','}`;
                  });
                }
                if (! isDryRun) await git.add({ fs, dir, filepath: currentLanguage.source.path });
                if (! isDryRun) await git.add({ fs, dir, filepath: currentLanguage.transformed.path });
              }
            }
            try {
              if (isDryRun) {
                console.log(message);
                core.setOutput('dry_run_is_successful', 'true');
              }
              else {
                const commitResult = await git.commit({
                  fs,
                  dir,
                  author: {
                    name: gitUserName,
                    email: gitUserMail
                  },
                  message
                });
                if (commitResult) {
                  core.notice(`Commit is successfully made.`);
                  core.setOutput('is_commit_available', 'true');
                }
              }
            }
            catch (error) {
              core.error(`Can't make commit. Error is '${error}'.`);
              core.setFailed(`Can't make commit. Error is '${error}'.`);
            }
          }
          catch (error) {
            core.error(`Can't add files to commit. Error is '${error}'.`);
            core.setFailed(`Can't add files commit. Error is '${error}'.`);
          }
        }
      }
      catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
      }
    }
    catch (error) {
      core.error(error.message);
      core.setFailed(error.message);
    }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map