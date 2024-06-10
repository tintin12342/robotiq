export enum StepType {
    DefineVariableStep = "DefineVariableStep",
    ClickStep = "ClickStep",
    DoubleClickStep = "DoubleClickStep",
    StringInputStep = "StringInputStep",
    IfStep = "IfStep",
    ElseIfStep = "ElseIfStep",
    ElseStep = "ElseStep",
}

export interface WindowProcessInfo {
    waitWindowToActivate: boolean;
}

export interface StepBase {
    stepType: StepType;
    id: string;
    windowProcessInfo?: WindowProcessInfo;
}

export interface DefineVariableStep extends StepBase {
    stepType: StepType.DefineVariableStep;
    variableType: number;
    variableName: string;
    initialValue: string;
}

export interface ClickStep extends StepBase {
    stepType: StepType.ClickStep;
}

export interface DoubleClickStep extends StepBase {
    stepType: StepType.DoubleClickStep;
}

export interface StringInputStep extends StepBase {
    stepType: StepType.StringInputStep;
    value: string;
}

export interface IfStep extends StepBase {
    stepType: StepType.IfStep;
    children: Step[];
}

export interface ElseIfStep extends StepBase {
    stepType: StepType.ElseIfStep;
    children: Step[];
}

export interface ElseStep extends StepBase {
    stepType: StepType.ElseStep;
    children: Step[];
}

export type Step = DefineVariableStep | ClickStep | DoubleClickStep | StringInputStep | IfStep | ElseIfStep | ElseStep;

export interface RobotiqProcessInfo {
    id: string;
    organizationName: string;
    organizationId: string;
    name: string;
    description: string;
    author: string;
    version: string;
    createdOn: string;
    lastModified: string;
}

export interface Process {
    robotiqProcessInfo: RobotiqProcessInfo;
    steps: Step[];
}
