"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DingTalkApi = void 0;
class DingTalkApi {
    constructor() {
        this.name = 'dingTalkApi';
        this.displayName = 'Dingtalk API';
        this.properties = [
            {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                    {
                        name: 'AccessKey',
                        value: 'access_key',
                        description: 'AccessKey',
                        action: 'AccessKey',
                    },
                    {
                        name: 'Webhook',
                        value: 'webhook',
                        description: 'Webhook',
                        action: 'Webhook',
                    },
                ],
                default: 'access_key',
            },
            {
                displayName: 'WebhookUrl',
                name: 'webhookUrl',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        type: ['webhook'],
                    },
                },
            },
            {
                displayName: 'WebhookSign',
                name: 'webhookSign',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        type: ['webhook'],
                    },
                },
            },
            {
                displayName: 'Endpoint',
                name: 'endpoint',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        type: ['access_key'],
                    },
                },
            },
            {
                displayName: 'Access Key Id',
                name: 'accessKeyId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        type: ['access_key'],
                    },
                },
            },
            {
                displayName: 'Access Key Secret',
                name: 'accessKeySecret',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                displayOptions: {
                    show: {
                        type: ['access_key'],
                    },
                },
            },
            {
                displayName: 'Region Id',
                name: 'regionId',
                type: 'string',
                default: 'central',
                displayOptions: {
                    show: {
                        type: ['access_key'],
                    },
                },
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 3306,
            },
            {
                displayName: 'Connect Timeout',
                name: 'connectTimeout',
                type: 'number',
                default: 10000,
                description: 'The milliseconds before a timeout occurs during the initial connection to the MySQL server',
            },
            {
                displayName: 'SSL',
                name: 'ssl',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'CA Certificate',
                name: 'caCertificate',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                    password: true,
                },
                displayOptions: {
                    show: {
                        ssl: [true],
                    },
                },
                type: 'string',
                default: '',
            },
            {
                displayName: 'Client Private Key',
                name: 'clientPrivateKey',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                    password: true,
                },
                displayOptions: {
                    show: {
                        ssl: [true],
                    },
                },
                type: 'string',
                default: '',
            },
            {
                displayName: 'Client Certificate',
                name: 'clientCertificate',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                    password: true,
                },
                displayOptions: {
                    show: {
                        ssl: [true],
                    },
                },
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.DingTalkApi = DingTalkApi;
//# sourceMappingURL=DingTalkApi.credentials.js.map