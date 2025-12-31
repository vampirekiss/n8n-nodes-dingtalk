"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DingTalkCustomRobotApi = void 0;
class DingTalkCustomRobotApi {
    constructor() {
        this.name = 'dingTalkCustomRobotApi';
        this.displayName = 'DingTalkCustomRobot API';
        this.properties = [
            {
                displayName: 'WebhookUrl',
                name: 'webhookUrl',
                type: 'string',
                default: '',
                required: true
            },
            {
                displayName: 'WebhookSign',
                name: 'webhookSign',
                type: 'string',
                default: null,
            },
        ];
    }
}
exports.DingTalkCustomRobotApi = DingTalkCustomRobotApi;
//# sourceMappingURL=DingTalkCustomRobotApi.credentials.js.map