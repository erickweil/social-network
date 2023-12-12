//
//  HalfRoundedRectangle.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 10/10/23.
//

import SwiftUI

struct HalfRoundedRectangle : Shape {
    var radius: CGFloat = 20.0
    
    func path(in rect: CGRect) -> Path {
        //let path = UIBezierPath(
        //    roundedRect: rect,
        //    byRoundingCorners: corners,
        //    cornerRadii: CGSize(width: radius, height: radius)
        //)
        
        var path = Path()
        let w = rect.width
        let h = rect.height
        
        path.move(to: CGPoint(x: 0, y: h))
        path.addLine(to: CGPoint(x: 0, y: radius))
        path.addArc(
            center: CGPoint(x: radius, y: radius),
            radius: radius,
            startAngle: .degrees(180), endAngle: .degrees(270),
            clockwise: false
        )
        path.addLine(to: CGPoint(x: w, y: 0))
        path.addLine(to: CGPoint(x: w, y: h-radius))
        path.addLine(to: CGPoint(x: w-radius, y: h))
        path.addLine(to: CGPoint(x: 0, y: h))
        path.closeSubpath()
        
        
        return path
    }
}

extension View {
    func halfRounded(radius: CGFloat = 20.0) -> some View {
        clipShape( HalfRoundedRectangle(radius: radius) )
    }
}
