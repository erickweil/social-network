//
//  HeartSZ.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 10/10/23.
//

import SwiftUI

struct HeartSZ : Shape {
    let left: Bool
    let right: Bool
    
    init(left: Bool = true,right: Bool = true) {
        self.left = left;
        self.right = right;
    }
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        let radius = w / 4.0
        let topoff = w * 0.022
        let rightoff = w * 0.064
        
        if left {
            //path.move(to:  CGPoint(x: 0, y: radius))
            
            path.move(to: CGPoint(x:w/2, y: h))
            
            path.addCurve(
                to: CGPoint(x: 0, y: radius),
                control1: CGPoint(x: w/2 - radius/12,y: h/2),
                control2: CGPoint(x: 0, y: h/2)
            )
            
            path.addArc(
                center: CGPoint(x: radius, y: radius),
                radius: radius,
                startAngle: .degrees(180), endAngle: .degrees(0),
                clockwise: false
            )
        }
        
        if right {
            path.move(to: CGPoint(x: radius*2, y: radius))
            path.addLine(to: CGPoint(x: w/2, y: topoff))
            path.addLine(to: CGPoint(x: w + rightoff, y: topoff))
            path.addLine(to: CGPoint(x: w/2, y: h))
        }
        
        return path
    }
}

struct HeartSZIcon: View {
    var filled: Bool = false
    var fillColor: Color = .destaque
    var body: some View {
        if filled {
            HeartSZ().fill(fillColor)
        } else {
            HeartSZ().stroke(Color.secundaria, lineWidth: 1.50)
        }
    }
}

struct HeartSZTestAnim: View {
    @State var anim = 0.5
    var body: some View {
        VStack {
            Slider(value: $anim)
            
            ZStack {
                HeartSZ(left: true, right: false)
                    .trim(from: 0, to: anim*2)
                    .stroke(Color.destaque,lineWidth: 5.50)
                    .padding(40)
                    .frame(width: 200, height: 200)
                
                HeartSZ(left: false, right: true)
                    .trim(from: 0, to: anim*2 - 1.0)
                    .stroke(Color.primaria,lineWidth: 5.50)
                    .padding(40)
                    .frame(width: 200, height: 200)
            }
        }.padding()
    }
}

struct HeartSZ_Previews: PreviewProvider {
    static var previews: some View {
        HeartSZTestAnim()
    }
}
