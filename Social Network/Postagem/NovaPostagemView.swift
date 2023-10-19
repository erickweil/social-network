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
    
    var body: some View {
        Form {
            Section("Postagem") {
                MeuInput("Conteúdo", texto: $vm.conteudo, erro: vm.erroConteudo, autoCapitalization: .sentences)
                    .keyboardType(.default)
            }
                        
            Button("Postar") {
                if vm.validarFormulario() {
                    Task {
                        do {
                            if let usuario = try await vm.realizarCadastro(token: store.token) {
                                DispatchQueue.main.async {
                                    vm.setarMensagemErro("Postado com sucesso!")
                                    dismiss()
                                }
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
            .frame(maxWidth: .infinity, alignment: .trailing)
        }
        .navigationTitle("Cadastrar")
        .toolbar() {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Cancelar") {
                    dismiss();
                }
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
        NovaPostagemView()
    }
}
