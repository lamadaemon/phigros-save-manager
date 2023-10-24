export class APIEndpoints {
    static readonly fileTokens = "/fileTokens"
    static readonly fileCallback = "/fileCallback"
    static readonly save = "/classes/_GameSave"
    static readonly userInfo = "/users/me"
    static readonly files = "/files"

    static logout(userId: string) {
        return `/users/${userId}/refreshSessionToken`
    }
}