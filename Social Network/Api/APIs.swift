//
//  APIs.swift
//  Memoria
//
//  Created by Erick Leonardo Weil on 25/08/23.
//

import Foundation

enum APIs {
    case postagens
    case respostasPostagem(String)
    case postagensCurtidas
    case login
    case curtirPostagem(String)
    case usuarioLogado
    case usuarios
    
    public static var baseURL: URL {
        URL(string: "https://socialize-api.app.fslab.dev")!
    }
    
    
    var url: URL {
        switch self {
        case .postagens:
            return APIs.baseURL.appendingPathComponent("/postagens")
        case .postagensCurtidas:
            return APIs.baseURL.appendingPathComponent("/usuarios/curtidas")
        case .respostasPostagem(let id):
            return APIs.baseURL.appendingPathComponent("/postagens/\(id)/respostas")
        case .login:
            return APIs.baseURL.appendingPathComponent("/login")
        case .curtirPostagem(let id):
            return APIs.baseURL.appendingPathComponent("/postagens/\(id)/curtidas")
        case .usuarioLogado:
            return APIs.baseURL.appendingPathComponent("/usuarios/logado")
        case .usuarios:
            return APIs.baseURL.appendingPathComponent("/usuarios")
        }
    }
}
