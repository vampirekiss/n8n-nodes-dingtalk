"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DingTalkCompanyApi = void 0;
class DingTalkCompanyApi {
    constructor() {
        this.name = 'dingTalkCompanyApi';
        this.displayName = 'DingtalkCompany API';
        this.properties = [
            {
                displayName: 'Robot Code',
                name: 'robotCode',
                type: 'string',
                default: '',
                required: true
            },
            {
                displayName: 'Access Key Id',
                name: 'accessKeyId',
                type: 'string',
                default: '',
                required: true
            },
            {
                displayName: 'Access Key Secret',
                name: 'accessKeySecret',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true
            },
            {
                displayName: 'protocol',
                name: 'protocol',
                type: 'string',
                default: '',
                required: true
            },
            {
                displayName: 'region id',
                name: 'regionId',
                type: 'string',
                default: '',
                required: true
            }
        ];
    }
}
exports.DingTalkCompanyApi = DingTalkCompanyApi;
//# sourceMappingURL=DingTalkCompanyApi.credentials.js.map