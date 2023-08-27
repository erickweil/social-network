//
//  SessionModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import Foundation

struct APISession {
    // https://stackoverflow.com/questions/52591866/whats-the-correct-usage-of-urlsession-create-new-one-or-reuse-same-one
    public var token: String?
    public var usuario: Usuario?    
}
