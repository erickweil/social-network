/*
A ideia desta classe é guardar todo o estado da aplicação
As informações nesta classes são a 'VERDADE' da inteira aplicação
 
Caso este arquivo fique muito grande é perfeitamente OK dividir o estado
*/
import SwiftUI

// @MainActor A singleton actor whose executor is equivalent to the main dispatch queue.
@MainActor
class AppDataStore: ObservableObject {
    let httpClient: HTTPClient
    @Published var session: APISession = APISession()
    
    let imageCache: ImageCacheViewModel = ImageCacheViewModel()
    
    init(httpClient: HTTPClient) {
        self.httpClient = httpClient
    }
    
    public func fazerLogin(email: String, senha: String) async throws {
        let resp = try await httpClient.fetch(
            APIs.login.url,
            FetchOptions(
                method: .POST,
                body: JSONEncoder().encode([
                    "email": email,
                    "senha": senha
                ])
            )
        )
        
        if let respModel = try resp.body?.json(LoginResponse.self) {
            session.token = respModel.token
            session.usuario = respModel.usuario
        }
    }
}
