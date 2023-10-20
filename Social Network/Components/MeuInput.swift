//
//  MeuInput.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/09/23.
//

import SwiftUI


struct MeuInput: View {
    
    enum TipoInput {
        case password
        case singleLineText
        case multilineText
    }
    
    var label: String
    @Binding var texto: String
    var erro: String?
    var tipo: TipoInput
    @FocusState private var estaFocado: Bool
    var autoCapitalization: TextInputAutocapitalization
    var autoCorrection: Bool
    
    // https://www.hackingwithswift.com/quick-start/swiftui/how-to-detect-dark-mode
    @Environment(\.colorScheme) var colorScheme
    
    init(_ label: String,
         texto: Binding<String>,
         erro: String? = nil,
         tipo: TipoInput = .singleLineText,
         autoCapitalization: TextInputAutocapitalization = .never,
         autoCorrection: Bool = false) {
        self.label = label
        self._texto = texto
        self.erro = erro
        self.tipo = tipo
        self.autoCapitalization = autoCapitalization
        self.autoCorrection = autoCorrection
    }
    
    func getFieldTextOrPasswordField(_ tipo: TipoInput) -> some View {
        VStack {
            if tipo == .password {
                SecureField("", text: $texto)
                    .focused($estaFocado)
                    .textInputAutocapitalization(autoCapitalization)
                    .autocorrectionDisabled(!autoCorrection)
            } else if tipo == .multilineText {
                // Não funciona dentro de um form?
                TextEditor(text: $texto)
                    .focused($estaFocado)
                    .textInputAutocapitalization(autoCapitalization)
                    .autocorrectionDisabled(!autoCorrection)
            } else {
                TextField("", text: $texto)
                    .focused($estaFocado)
                    .textInputAutocapitalization(autoCapitalization)
                    .autocorrectionDisabled(!autoCorrection)
            }
        }
    }
    
    var body: some View {
        let diminuirLabel = estaFocado || !texto.isEmpty
        let cor: Color =
            erro != nil ? Color(.systemRed) :
        estaFocado ? Color.destaque :
            Color.secundaria
        let padding = 10.0
        
        VStack(alignment: .leading) {
                getFieldTextOrPasswordField(tipo)
                .padding(padding)
                .colocarBorda(8, lineWidth: estaFocado ? 2 : 1, strokeColor: cor)
                .overlay {
                    Text(label)
                        .font(diminuirLabel ? .system(size: 12.0) : .body)
                        .padding(.horizontal,diminuirLabel ? 5 : 0)
                        .background(colorScheme == .dark ? Color.fundo : Color.fundo)
                        .padding(.leading,padding)
                        .frame(
                            maxWidth: .infinity,
                            maxHeight: .infinity,
                            alignment:  diminuirLabel ? .topLeading : .leading)
                        .offset(y:diminuirLabel ? -7.0 : 0.0)
                        .foregroundColor(cor)
                        .allowsHitTesting(false)
                        .animation(.easeInOut(duration: 0.15), value: diminuirLabel)
                }
            if let erro {
                Text(erro)
                    .font(.caption)
                    .padding(.leading,padding)
                    .foregroundColor(cor)
            }
        }
        .listRowSeparator(.hidden)
    }
}

struct ExemploMeuInput: View {
    @State var nome: String = ""
    @State var sobrenome: String = ""
    @State var senha1: String = ""
    @State var senha2: String = ""
    @State var bio: String = ""
    
    @State var erroSenha: String?
    var body: some View {
        Form {
            Section("Teste") {
                MeuInput("Nome",texto: $nome)
                MeuInput("Sobrenome",texto: $sobrenome)
                MeuInput("Senha",texto: $senha1,erro: erroSenha, tipo: .password)
                MeuInput("Senha",texto: $senha2,erro: erroSenha, tipo: .password)
                MeuInput("Biografia",texto: $bio, tipo: .multilineText)
                
                
                Button("Validar") {
                    if senha1 != senha2 {
                        erroSenha = "As senhas não batem"
                    } else {
                        erroSenha = nil
                    }
                }
                .buttonStyle(.borderedProminent)
                .frame(maxWidth: .infinity, alignment: .trailing)
            }
        }
    }
}

struct MeuInput_Previews: PreviewProvider {
    static var previews: some View {
        ExemploMeuInput()
    }
}
