//
//  NeonFlicker.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 17/10/23.
//

import SwiftUI

struct NeonFlicker: AnimatableModifier {
    var backColor: Color
    var frontColor: Color
    var rotation: Double // 0 - 360
    var cornerRadius = 15.0
    var lineWidth = 5.0
        
    var animatableData: Double {
        get { rotation }
        set { rotation = newValue }
    }
    
    init(isFaceUp: Bool, backColor: Color, frontColor: Color) {
        self.backColor = backColor
        self.frontColor = frontColor
        self.rotation = isFaceUp ? 0 : 180
    }
    
    func body(content: Content) -> some View {
        ZStack {
            content
                .brightness(0.4)
                .blur(radius: 10.0)
            
            content
                .brightness(0.3)
                .blur(radius: 15.0)
            
            content
                .blur(radius: 20.0)
            
            content
                .blur(radius: 25.0)
            
            content
                .brightness(0.5)
                .blur(radius: 4.0)
            
            content
                .brightness(0.75)
                .shadow(radius: 1.0)
        }
        .foregroundColor(rotation >= 0.01 ? frontColor : backColor)
        .opacity(rotation >= 0 && rotation <= 1 ? 1 : 0)
    }
}

extension View {
    func neonFlicker(isFaceUp: Bool, backColor: Color, frontColor: Color) -> some View {
        self.modifier(NeonFlicker(isFaceUp: isFaceUp, backColor: backColor, frontColor: frontColor))
    }
}

struct NeonFlicker_Previews: PreviewProvider {
    static var previews: some View {
        Rectangle()
            .stroke(lineWidth: 4.0)
            .neonFlicker(isFaceUp: true, backColor: Color.red, frontColor: Color.blue)
            .frame(width: 200,height: 200)
    }
}
