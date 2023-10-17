//
//  NovoLoginView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 05/09/23.
//

import SwiftUI

// Indica se fez ou não Login
/*struct FezLoginKey: EnvironmentKey {
    static let defaultValue: Binding<Bool> = .constant(false)
}

extension EnvironmentValues {
    var fezLogin: Binding<Bool> {
        get { return self[FezLoginKey.self] }
        set { self[FezLoginKey.self] = newValue }
    }
}*/

struct NovoLoginView<Content>: View where Content: View {
    
    var content: () -> Content
    
    // Estado global da aplicação
    @EnvironmentObject private var vm: LoginViewModel
    
    var body: some View {
        ZStack {
            VStack(spacing: 20.0) {
                
                NavigationLink(isActive: $vm.navegarLogin, destination: {
                    content()
                        .environmentObject(vm)
                }, label: {
                    EmptyView()
                })
                
                //Image("Logo")
                //    .resizable()
                //    .aspectRatio(contentMode: .fit)
                //    .frame(maxWidth: 200)
                //    .padding(.bottom, 40)
                
                VStack(spacing: 20.0) {
                    Text("Login")
                        .font(.largeTitle)
                        .bold()
                    
                    MeuInput("Email", texto: $vm.email, erro: vm.erroEmail)
                    MeuInput("Senha", texto: $vm.senha, erro: vm.erroSenha, password: true)
                    Button("Acessar") {
                        if vm.validarFormulario() {
                            Task {
                                do {
                                    try await vm.fazerLogin(
                                        email: vm.email,
                                        senha: vm.senha)
                                } catch {
                                    DispatchQueue.main.async {
                                        vm.setarMensagemErro(error.localizedDescription)
                                    }
                                }
                            }
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    
                    HStack {
                        Text("Novo por aqui?")
                        NavigationLink("Cadastre-se", destination: {
                            ViewExample(imageName: "person.fill", color: .systemBlue)
                        })
                    }
                    .padding(.bottom, 20)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(20.0)
                .background(Color(.systemBackground))
                .halfRounded(radius: 80.0)
                .shadow(color:.white,radius: 15.0,x:1,y:1)
                
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
        
        return NavigationView {
            NovoLoginView {
                VStack {
                        Text("OK FEZ LOGIN")
                }
            }
            .frame(maxWidth: .infinity,maxHeight: .infinity)
            .background(.black,ignoresSafeAreaEdges: .all)
            .environmentObject(LoginViewModel())
        }
    }
}
