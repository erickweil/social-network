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
    var imageCache: ImageCache = ImageCache()
    
    init(httpClient: HTTPClient) {
        self.httpClient = httpClient
    }
    
    public func fazerLogin(email: String, senha: String) async throws {
        let resp = try await httpClient.load(
            Resource(
                url: APIs.login.url,
                method: .post(JSONEncoder().encode([
                    "email": email,
                    "senha": senha
                ])),
                modelType: LoginResponse.self
            ),
            session: session.session
        )
        
        session.token = resp.token
        session.usuario = resp.usuario
    }
}
