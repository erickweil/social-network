//
//  PostagemModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import Foundation

struct Postagem: Hashable, Codable, Identifiable {
    var id: String { _id }
    let _id: String
    let usuario: Usuario
    let conteudo: String
    let hashtags: [String]
    let imagens: [String]
    var numCurtidas: Int
    let numRespostas: Int
    let nivel: Int
    let deletado: Bool?
    let created_at: String
    
    let postagemPai: String?
    let posicao: Int?
    let respostas: [Postagem]?
}

struct CurtidaResponse: Hashable, Codable {
    let message: String
    let numCurtidas: Int
    let estaCurtida: Bool
}

typealias ListagemPostagem = ListagemDeAlgo<Postagem>
