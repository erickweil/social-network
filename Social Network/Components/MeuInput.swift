//
//  MeuInput.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/09/23.
//

import SwiftUI


struct MeuInput: View {
    var label: String
    @Binding var texto: String
    var erro: String?
    var password: Bool
    @FocusState private var estaFocado: Bool
    
    // https://www.hackingwithswift.com/quick-start/swiftui/how-to-detect-dark-mode
    @Environment(\.colorScheme) var colorScheme
    
    init(_ label: String, texto: Binding<String>, erro: String? = nil, password: Bool = false) {
        self.label = label
        self._texto = texto
        self.erro = erro
        self.password = password
    }
    
    func getFieldTextOrPasswordField(password: Bool) -> some View {
        HStack {
            if password {
                SecureField("", text: $texto)
                    .focused($estaFocado)
                    .textInputAutocapitalization(.never)
            } else {
                TextField("", text: $texto)
                    .focused($estaFocado)
                    .textInputAutocapitalization(.never)
            }
        }
    }
    
    var body: some View {
        let diminuirLabel = estaFocado || !texto.isEmpty
        let cor: Color =
            erro != nil ? Color(.systemRed) :
            estaFocado ? .accentColor :
            .secondary
        let padding = 10.0
        
        VStack(alignment: .leading) {
                getFieldTextOrPasswordField(password: password)
                .padding(padding)
                .colocarBorda(8, lineWidth: estaFocado ? 2 : 1, strokeColor: cor)
                .overlay {
                    Text(label)
                        .font(diminuirLabel ? .system(size: 12.0) : .body)
                        .padding(.horizontal,diminuirLabel ? 5 : 0)
                        .background(Color(colorScheme == .dark ? .secondarySystemBackground : .systemBackground))
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

struct MeuInput_Previews: PreviewProvider {
    static var previews: some View {
        Form {
            Section("Teste") {
                MeuInput("Nome",texto: .constant(""))
                MeuInput("Sobrenome",texto: .constant(""))
                MeuInput("Senha",texto: .constant(""),erro: "As senhas devem ser iguais", password: true)
                MeuInput("Senha",texto: .constant(""), password: true)
            }
        }
    }
}
