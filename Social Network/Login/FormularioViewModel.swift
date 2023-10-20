//
//  FormularioViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 19/10/23.
//

import Foundation
import SwiftUI

class FomularioViewModel: ObservableObject {
    
    @Published var exibirMensagemErro: Bool = false
    private(set) var mensagemErro: String = ""
    
    func setarMensagemErro(_ erro: String) {
        mensagemErro = erro
        if erro == "" {
            exibirMensagemErro = false
        } else {
            exibirMensagemErro = true
        }
    }
    
    func validaObrigatorio(_ txt: String) -> String? {
        if txt.isEmpty {
            return "Este campo é obrigatório"
        } else {
            return nil
        }
    }
    
    func validaSenhaIgual(_ txt1: String,_ txt2: String) -> String? {
        if txt1 != txt2 {
            return "As senhas não correspondem"
        } else {
            return nil
        }
    }
    
    func validaEmail(_ txt: String) -> String? {
        // https://www.hackingwithswift.com/articles/108/how-to-use-regular-expressions-in-swift
        let regexPattern = "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
        let regex = try! NSRegularExpression(pattern: regexPattern)
        if let _ = regex.firstMatch(in: txt, range: NSRange(location: 0, length: txt.utf16.count)) {
            return nil
        } else {
            return "Email inválido"
        }
    }
}
