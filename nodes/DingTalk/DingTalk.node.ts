import { IExecuteFunctions } from 'n8n-workflow';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import * as $Util from '@alicloud/tea-util';
import RobotClient, * as $RobotClient from '@alicloud/dingtalk/dist/robot_1_0/client';
import * as $OpenApi from '@alicloud/openapi-client';
import AuthClient, * as $AuthClient from '@alicloud/dingtalk/dist/oauth2_1_0/client';


export class DingTalk implements INodeType {
	description: INodeTypeDescription = {
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


	async execute(this: IExecuteFunctions & DingTalk): Promise<INodeExecutionData[][]> {
		const result: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('dingTalkCompanyApi') as Credentials
		const apiClient = new DingtalApiClient(credentials, this.helpers)
		const items = this.getInputData()
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const item = items[itemIndex]
			const api = this.getNodeParameter("api", itemIndex) as string
			const json = this.getNodeParameter("json", itemIndex) as string
			try {
				const params = JSON.parse(json)
				const apiResult = await apiClient.call(api, params)
				result.push(apiResult)
			} catch (error) {
				if (this.continueOnFail()) {
					result.push({
						json: item.json,
						error,
						pairedItem: itemIndex,
					})
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex
						throw error
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					})
				}
			}
		}
		return this.prepareOutputData(result);
	}
}

type Credentials = {
	protocol: string
	regionId: string
	accessKeyId: string
	accessKeySecret: string
	robotCode: string
}

class DingtalApiClient {

	credentials: Credentials
	helpers: IExecuteFunctions['helpers']
	
	constructor(credentials: Credentials, helpers: IExecuteFunctions['helpers'])
	{
		this.credentials = credentials
		this.helpers = helpers
	}
	
	private async _getRobotClient() : Promise<RobotClient & {robotCode: string, token: string}> {
		// @ts-ignore  for cache
		if (!this._robotClient) { 
			const config = new $OpenApi.Config({});
			config.protocol = this.credentials.protocol
			config.regionId = this.credentials.regionId
			const oauth2Client = new AuthClient(config);
			const getAccessTokenRequest = new $AuthClient.GetAccessTokenRequest({
				appKey: this.credentials.accessKeyId,
				appSecret: this.credentials.accessKeySecret,
			})
			const accessTokenResult = await oauth2Client.getAccessToken(getAccessTokenRequest)
			const token = accessTokenResult?.body?.accessToken
			if (!token) {
				throw new Error('获取AccessToken失败');
			}
			const robotClient = new RobotClient(config) as RobotClient & {robotCode: string, token: string}
			robotClient.robotCode = this.credentials.robotCode
			robotClient.token = token
			// @ts-ignore  for cache
			this._robotClient = robotClient;
		}
		// @ts-ignore  for cache
		return this._robotClient
	}

	private async getDownloadUrl(params: Object): Promise<INodeExecutionData> {
		const { downloadCode } = params as { downloadCode: string }
		if (!downloadCode) {
			throw new Error('未提供downloadCode');
		}
		const client = await this._getRobotClient()
		const request = new $RobotClient.RobotMessageFileDownloadRequest({
			downloadCode,
			robotCode: client.robotCode,
		})
		const headers = new $RobotClient.RobotMessageFileDownloadHeaders()
		headers.xAcsDingtalkAccessToken = client.token
		const result = await client.robotMessageFileDownloadWithOptions(request, headers, new $Util.RuntimeOptions({}))
		if (!result.body?.downloadUrl) {
			throw new Error('远程请求未返回downloadUrl')
		}
		return {
			json: {
				downloadUrl: result.body.downloadUrl
			}
		}
	}

	public async call(api: string, params: Object): Promise<INodeExecutionData> {
		switch (api) {
			case 'getDownloadUrl':
				return await this.getDownloadUrl(params);
		}
		throw new Error("调用了未被支持的API：" + api)
	}
}
