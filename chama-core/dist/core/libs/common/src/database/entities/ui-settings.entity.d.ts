import { UiSettings, Prisma } from '../models';
export interface WidgetSettings {
    dashboard?: {
        contributions?: boolean;
        transactions?: boolean;
        notifications?: boolean;
    };
    profile?: {
        personalInfo?: boolean;
        preferences?: boolean;
    };
    chama?: {
        membersList?: boolean;
        contributionHistory?: boolean;
    };
}
export declare class UiSettingsEntity implements UiSettings {
    userId: string;
    showTutorial: boolean;
    theme: string | null;
    lastSeenWidgets: Prisma.JsonValue | null;
    constructor(partial: Partial<UiSettingsEntity>);
}
export declare class JsonFieldUtils {
    static safeJsonParse<T = any>(jsonString: string | null | undefined, defaultValue?: T | null): T | null;
    static safeJsonStringify(obj: any): string | null;
    static mergeWidgetSettings(current: WidgetSettings | null, updates: Partial<WidgetSettings>): WidgetSettings;
}
