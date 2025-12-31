"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DingTalk = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const $Util = __importStar(require("@alicloud/tea-util"));
const client_1 = __importStar(require("@alicloud/dingtalk/dist/robot_1_0/client")), $RobotClient = client_1;
const $OpenApi = __importStar(require("@alicloud/openapi-client"));
const client_2 = __importStar(require("@alicloud/dingtalk/dist/oauth2_1_0/client")), $AuthClient = client_2;
class DingTalk {
    constructor() {
        this.description = {
            displayName: 'DingTalk API',
            name: 'DingTalk API',
            icon: 'file:dingtalk.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["type"]}}',
            description: '调用DingTalk机器人系列API',
            defaults: {
                name: 'Ding Ding',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'dingTalkCompanyApi',
                    required: true
                },
            ],
            properties: [
                {
                    displayName: 'API',
                    name: 'api',
                    type: 'options',
                    required: true,
                    noDataExpression: true,
                    options: [
                        {
                            name: '获取downloadUrl',
                            value: 'getDownloadUrl',
                            description: '使用downloadCode（从私聊会话中获取）获取downloadUrl',
                        },
                    ],
                    default: 'getDownloadUrl',
                },
                {
                    displayName: 'JSON',
                    name: 'json',
                    type: 'json',
                    required: false,
                    hint: 'API调用的JSON参数',
                    default: ''
                }
            ],
        };
    }
    async execute() {
        const result = [];
        const credentials = await this.getCredentials('dingTalkCompanyApi');
        const apiClient = new DingtalApiClient(credentials, this.helpers);
        const items = this.getInputData();
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            const item = items[itemIndex];
            const api = this.getNodeParameter("api", itemIndex);
            const json = this.getNodeParameter("json", itemIndex);
            try {
                const params = JSON.parse(json);
                const apiResult = await apiClient.call(api, params);
                result.push(apiResult);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    result.push({
                        json: item.json,
                        error,
                        pairedItem: itemIndex,
                    });
                }
                else {
                    if (error.context) {
                        error.context.itemIndex = itemIndex;
                        throw error;
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex,
                    });
                }
            }
        }
        return this.prepareOutputData(result);
    }
}
exports.DingTalk = DingTalk;
class DingtalApiClient {
    constructor(credentials, helpers) {
        this.credentials = credentials;
        this.helpers = helpers;
    }
    async _getRobotClient() {
        var _a;
        if (!this._robotClient) {
            const config = new $OpenApi.Config({});
            config.protocol = this.credentials.protocol;
            config.regionId = this.credentials.regionId;
            const oauth2Client = new client_2.default(config);
            const getAccessTokenRequest = new $AuthClient.GetAccessTokenRequest({
                appKey: this.credentials.accessKeyId,
                appSecret: this.credentials.accessKeySecret,
            });
            const accessTokenResult = await oauth2Client.getAccessToken(getAccessTokenRequest);
            const token = (_a = accessTokenResult === null || accessTokenResult === void 0 ? void 0 : accessTokenResult.body) === null || _a === void 0 ? void 0 : _a.accessToken;
            if (!token) {
                throw new Error('获取AccessToken失败');
            }
            const robotClient = new client_1.default(config);
            robotClient.robotCode = this.credentials.robotCode;
            robotClient.token = token;
            this._robotClient = robotClient;
        }
        return this._robotClient;
    }
    async getDownloadUrl(params) {
        var _a;
        const { downloadCode } = params;
        if (!downloadCode) {
            throw new Error('未提供downloadCode');
        }
        const client = await this._getRobotClient();
        const request = new $RobotClient.RobotMessageFileDownloadRequest({
            downloadCode,
            robotCode: client.robotCode,
        });
        const headers = new $RobotClient.RobotMessageFileDownloadHeaders();
        headers.xAcsDingtalkAccessToken = client.token;
        const result = await client.robotMessageFileDownloadWithOptions(request, headers, new $Util.RuntimeOptions({}));
        if (!((_a = result.body) === null || _a === void 0 ? void 0 : _a.downloadUrl)) {
            throw new Error('远程请求未返回downloadUrl');
        }
        return {
            json: {
                downloadUrl: result.body.downloadUrl
            }
        };
    }
    async call(api, params) {
        switch (api) {
            case 'getDownloadUrl':
                return await this.getDownloadUrl(params);
        }
        throw new Error("调用了未被支持的API：" + api);
    }
}
//# sourceMappingURL=DingTalk.node.js.map