//
//  PlainFormStyle.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 24/10/23.
//

import SwiftUI

import SwiftUI

struct PlainFormStyle: FormStyle {
    func makeBody(configuration: Configuration) -> some View {
        ScrollView {
            VStack {
                configuration.content
            }
        }
    }
}

extension Form {
    func plainFormStyle() -> some View {
        var copy = self
        return copy.formStyle(PlainFormStyle())
    }
}

struct PlainFormStyle_Previews: PreviewProvider {
    static var previews: some View {
        Form {
            TextField("Teste", text: .constant("OK"))
            
            Button("Validar") {
            }
        }
        .plainFormStyle()
    }
}
