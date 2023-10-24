//
//  BordaModifier.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/09/23.
//

import SwiftUI

struct Borda: ViewModifier {
    var raio: CGFloat
    var lineWidth: CGFloat
    var strokeColor: Color?
    var fillColor: Color?
    func body(content: Content) -> some View {
        if lineWidth <= 0 {
            content
        } else {
            content
                .background {
                    ZStack {
                        let rect = RoundedRectangle(cornerRadius: raio)
                        
                        if let strokeColor {
                            rect.stroke(lineWidth: lineWidth).foregroundColor(strokeColor)
                        } else {
                            rect.stroke(lineWidth: lineWidth)
                        }
                        
                        if let fillColor {
                            rect.fill(fillColor)
                        }
                    }
                }
        }
    }
}

extension View {
    func colocarBorda(_ raio: CGFloat = 10, lineWidth: CGFloat = 1,strokeColor: Color? = nil, fillColor: Color? = nil) -> some View {
        modifier(Borda(raio: raio, lineWidth: lineWidth,strokeColor: strokeColor, fillColor: fillColor))
    }
}

struct BordaModifier_Previews: PreviewProvider {
    static var previews: some View {
        HStack {
            Text("A")
                .font(.largeTitle)
                .padding(20)
                .colocarBorda(20,lineWidth: 5,strokeColor: Color.green, fillColor: Color.black)
                .foregroundColor(Color.white)
        
            Text("Batata")
                .font(.largeTitle)
                .padding(20)
                .colocarBorda()
                .foregroundColor(Color.red)
        }
    }
}
