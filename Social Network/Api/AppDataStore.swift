/*
A ideia desta classe é guardar todo o estado da aplicação
As informações nesta classes são a 'VERDADE' da inteira aplicação
 
Caso este arquivo fique muito grande é perfeitamente OK dividir o estado
*/
import SwiftUI

// @MainActor A singleton actor whose executor is equivalent to the main dispatch queue.
@MainActor
class AppDataStore: ObservableObject {
    let session: APISessionViewModel = APISessionViewModel()
    let imageCache: ImageCacheViewModel = ImageCacheViewModel()
    
    init(fake: Bool = false) {
        if fake {
            self.session.token = "AAAAA"
            self.session.usuario = Usuario(_id: "-1", nome: "João Da Silva", email: "email@example.com", fotoPerfil: "/img/64c0251e2296e61e0f501ba7/98ccd7ed-0163-47dd-8dba-4ad5243b7cb3.jpg", fotoCapa: "", biografia: "olá", created_at: "", updated_at: "")
        }
    }
}
