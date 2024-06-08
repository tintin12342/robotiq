export enum StepType {
    DefineVariableStep = "DefineVariableStep",
    ClickStep = "ClickStep",
    DoubleClickStep = "DoubleClickStep",
    StringInputStep = "StringInputStep",
    IfStep = "IfStep",
    ElseIfStep = "ElseIfStep",
    ElseStep = "ElseStep",
}

interface WindowProcessInfo {
    waitWindowToActivate: boolean;
}

interface StepBase {
    stepType: StepType;
    id: string;
    windowProcessInfo?: WindowProcessInfo;
}

interface DefineVariableStep extends StepBase {
    stepType: StepType.DefineVariableStep;
    variableType: number;
    variableName: string;
    initialValue: string;
}

interface ClickStep extends StepBase {
    stepType: StepType.ClickStep;
}

interface DoubleClickStep extends StepBase {
    stepType: StepType.DoubleClickStep;
}

interface StringInputStep extends StepBase {
    stepType: StepType.StringInputStep;
    value: string;
}

interface IfStep extends StepBase {
    stepType: StepType.IfStep;
    children: Step[];
}

interface ElseIfStep extends StepBase {
    stepType: StepType.ElseIfStep;
    children: Step[];
}

interface ElseStep extends StepBase {
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
