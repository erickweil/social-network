//
//  NovoLoginView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 05/09/23.
//

import SwiftUI


struct NovoLoginView<Content>: View where Content: View {
    var content: () -> Content
    
    @EnvironmentObject
    var store: AppDataStore
    
    @StateObject
    var vm: ViewModel = ViewModel()
    
    var body: some View {
        ZStack {
            NavigationLink("Clique", isActive: $vm.autenticado, destination: {
                content()
            })
            
            Color("AccentColor")
                .ignoresSafeArea()
            
            VStack {
                Image("Logo")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: 200)
                
                Form {
                    Text("Entrar")
                        .bold()
                    //TextField("Email", text: $vm.email)
                    //   .textFieldStyle(.roundedBorder)
                    //   .textInputAutocapitalization(.never)
                    //SecureField("Senha", text: $vm.senha)
                    //   .textFieldStyle(.roundedBorder)
                    
                    MeuInput("Email", texto: $vm.email, erro: vm.erroEmail)
                    
                    MeuInput("Senha", texto: $vm.senha, erro: vm.erroSenha, password: true)
                    
                    Button("Acessar") {
                        if vm.validarFormulario() {
                            Task {
                                do {
                                    try await store.session.fazerLogin(
                                        httpClient: store.httpClient,
                                        email: vm.email,
                                        senha: vm.senha)
                                    
                                    DispatchQueue.main.async {
                                        vm.setarMensagemErro("")
                                        vm.autenticado = true
                                    }
                                } catch {
                                    DispatchQueue.main.async {
                                        vm.setarMensagemErro(error.localizedDescription)
                                    }
                                }
                            }
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }
                .frame(maxWidth: 350,maxHeight: .infinity)
                .clipShape(
                    RoundedRectangle(cornerRadius: 20)
                )
                
            }
            .padding(40)
            
        }
        .alert(vm.mensagemErro, isPresented: $vm.exibirMensagemErro) {
            Button("Fechar") {
                
            }.buttonStyle(.bordered)
        }
        
    }
}

struct NovoLoginView_Previews: PreviewProvider {
    static var previews: some View {
        let store = AppDataStore(httpClient: HTTPClient())
        
        return NavigationView {
            NovoLoginView {
                VStack {
                    if let token = store.session.token {
                        Text("OK FEZ LOGIN")
                        Text(token)
                            .textSelection(.enabled)
                            .padding()
                    } else {
                        Text("PRECISA AUTENTICAR")
                    }
                }
            }
        }
        .environmentObject(store)
    }
}
