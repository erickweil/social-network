//
//  LoginView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import SwiftUI

// Depois fazer esta tela funcionar de verdade...
struct LoginView<Content>: View where Content: View {
    // Estado global da aplicação
    @EnvironmentObject private var store: AppDataStore
    
    @StateObject var vm = ViewModel()
    
    @State var shouldNavigate: Bool = false
    var content: () -> Content
    
    func fazerLogin() async {
        do {
            //try await store.session.fazerLogin(httpClient: store.httpClient,email: "joao@email.com", senha: "ABCDabcd1234")
            try await store.session.fazerLogin(httpClient: store.httpClient,email: vm.username, senha: vm.password)
            shouldNavigate = true
        } catch {
            print(error.localizedDescription)
            vm.msgLoginInvalido = true
        }
    }
    
    var body: some View {
        
        if shouldNavigate {
            VStack {
                NavigationLink(
                    isActive: $shouldNavigate,
                    destination: content,
                    label: {
                        Text("Autenticando...")
                    }
                )
                
                Text("Seja Bem vindo **\(vm.username)**!")
                Text("Hoje é: **\(Date().formatted(.dateTime))**!")
 
            }
            .animation(.easeIn(duration: 1.0), value: store.session.token)
            .transition(.offset(x:0, y: 850))
        } else {
            ZStack {
                LinearGradient(colors: [.cyan,.white], startPoint: .top, endPoint: .bottom)
                    .ignoresSafeArea()
                
                VStack(alignment: .leading, spacing: 20) {
                    Spacer()
                    Text("Fazer login")
                        .foregroundColor(.white)
                        .font(.system(size:50, weight: .medium, design: .rounded))
                    
                    TextField("Usuário", text: $vm.username)
                        .textFieldStyle(.roundedBorder)
                        .textInputAutocapitalization(.never)
                    
                    SecureField("Senha", text: $vm.password)
                        .textFieldStyle(.roundedBorder)
                        .textInputAutocapitalization(.never)
                        .privacySensitive()
                    HStack {
                        Spacer()
                        Button("Esqueceu a senha?", action: vm.logPressed)
                            .tint(.red.opacity(0.8))
                        Spacer()
                        Button("Fazer Login", action: {
                            Task {
                                await fazerLogin()
                            }
                        })
                            .buttonStyle(.bordered)
                        Spacer()
                    }
                    Spacer()
                }
                .padding(.horizontal, 40)
                .frame(maxWidth: 350)
            }
            .animation(.easeIn(duration: 1.0), value: store.session.token)
            .transition(.offset(x:0, y: 850))
            .alert("Acesso Negado", isPresented: $vm.msgLoginInvalido ) {
                Button("Fechar", action: vm.logPressed)
            }
            //
        }
        
        
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        let store = AppDataStore(httpClient: HTTPClient())
        
        return NavigationView {
            LoginView {
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
