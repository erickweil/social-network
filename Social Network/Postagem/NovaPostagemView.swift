//
//  NovaPostagemView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 19/10/23.
//

import SwiftUI

struct NovaPostagemView: View {
    
    @EnvironmentObject private var store: LoginViewModel
    
    @Environment(\.dismiss) var dismiss
    // Estado global da aplicação
    @StateObject private var vm: NovaPostagemViewModel = NovaPostagemViewModel()
    
    var onNovoPost: (Postagem) -> Void
    
    var body: some View {
        Form {
            Section {
                MeuInput("Conteúdo", texto: $vm.conteudo, erro: vm.erroConteudo, tipo: .multilineText, autoCapitalization: .sentences)
                    .frame(minHeight: 60)
                    .keyboardType(.default)
            }
            .padding(.top, 20)
        }
        .navigationTitle("Nova Postagem")
        .toolbar() {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Cancelar") {
                    dismiss();
                }
            }
            
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Postar") {
                    if vm.validarFormulario() {
                        Task {
                            do {
                                if let novoPost = try await vm.realizarCadastro(token: store.token) {
                                    DispatchQueue.main.async {
                                        vm.setarMensagemErro("Postado com sucesso!")
                                        onNovoPost(novoPost)
                                        dismiss()
                                    }
                                }
                            } catch NetworkError.unauthorized {
                                DispatchQueue.main.async {
                                    store.estaLogado = false
                                }
                            } catch {
                                DispatchQueue.main.async {
                                    vm.setarMensagemErro(error.localizedDescription)
                                }
                            }
                        }
                    }
                }.buttonStyle(.borderedProminent)
            }
        }
        .alert(vm.mensagemErro, isPresented: $vm.exibirMensagemErro) {
            Button("Fechar") {
                
            }.buttonStyle(.bordered)
        }
    }
}

struct NovaPostagemView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            NovaPostagemView(onNovoPost: { post in
                print(post)
            })
        }
    }
}
