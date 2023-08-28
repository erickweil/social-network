/*
A ideia desta classe é guardar todo o estado da aplicação
As informações nesta classes são a 'VERDADE' da inteira aplicação
 
Caso este arquivo fique muito grande é perfeitamente OK dividir o estado
*/
import SwiftUI

// @MainActor A singleton actor whose executor is equivalent to the main dispatch queue.
@MainActor
class AppDataStore: ObservableObject {
    var AppNS: Namespace.ID?
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
        
        guard resp.success else {
            throw NetworkError.errorResponse("Não conseguiu autenticar")
        }
        
        let respModel = try resp.json(LoginResponse.self)
        
        DispatchQueue.main.async {
            self.session.token = respModel.token
            self.session.usuario = respModel.usuario
        }
    }
}
