import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class DingTalk implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions & DingTalk): Promise<INodeExecutionData[][]>;
}
