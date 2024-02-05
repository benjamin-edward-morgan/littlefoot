
//electronics enclosure 
base_w = 80;
base_l = 85;
base_screw_y_offs = 18;
base_screw_d = 3;
base_t = 4;
wall_t = 2;
xy_clearence = 3;
xy_tol = 0.2;

//body (jeep)
body_rear_mount_w = 91;
body_rear_mount_z = 12;
body_rear_mount_x = -80; 
body_front_mount_w = 67;
body_front_mount_z = 32;
body_front_mount_x = 140;
interior_clearence = 52;

//electronics 
perf_board_w = 70.5;
perf_board_l = 91;
perf_board_t = 1.2; 
perf_board_hole_d = 3;
perf_board_holes = [
    [-perf_board_l/2+4.3, -perf_board_w/2+4.3],
    [-perf_board_l/2+4.3, perf_board_w/2-3.6],
    [perf_board_l/2-4.3, perf_board_w/2-5.6],
    [perf_board_l/2-3, -perf_board_w/2+3.8],
];



enclosure_w = perf_board_w + 2*(xy_clearence + wall_t);
enclosure_l = perf_board_l + 2*(xy_clearence + wall_t);
enclosure_x_offs = 8;
enclosure_z_offs = 12;
enclosure_h = 50;

//hardware
bolt_d = 3;
nut_w = 5.4;
nut_r = nut_w/(2*cos(30));
nut_h = 2.27;
nut_tol = nut_h + xy_tol + wall_t;


//echo(nut_r);


//assembly();

module assembly() {
    
    
    
    translate([enclosure_x_offs,0,10]) {
        translate([0,0,enclosure_z_offs + 12])
        board();
        
        translate([0,0,enclosure_z_offs + 12 + 25])
        board();
    }

    
    electronics_base();

    body();
    
}



module body() {
    
    for(i=[-body_rear_mount_w/2,body_rear_mount_w/2])
    translate([body_rear_mount_x,i,body_rear_mount_z])
    cylinder(r=4, h = 30);
    
    for(i=[-body_front_mount_w/2,body_front_mount_w/2])
    translate([body_front_mount_x,i,body_front_mount_z])
    cylinder(r=4, h = 30);
    
}

  //  linear_extrude(12)
    //square([10, 10], center=true);
    

module nut_negative() {
    cylinder(r=nut_r+xy_tol,h = nut_h + 2*xy_tol, $fn=6);
    translate([0,0,-2])
    cylinder(r=bolt_d/2+xy_tol, h = 30, $fn=16, center = true);
}

/*
difference() {
    cylinder(r=7, h=8);

    translate([0,0,8 - nut_tol])
    nut_negative();
}
*/

//electronics_base();
module electronics_base() {
    
    
difference() {
    union() {
    difference() {
        
        //body exterior, screw mounts for lid
        union() {
            linear_extrude(12)
            square([base_l, base_w], center=true);
            
            hull() {
                translate([0,0,12])
                linear_extrude(1)
                square([base_l, base_w], center=true);
                
                
                translate([enclosure_x_offs, 0, enclosure_z_offs + 12])
                linear_extrude(1)
                square([enclosure_l, enclosure_w], center=true);
            }
            
              translate([enclosure_l/2 + enclosure_x_offs - enclosure_z_offs - 12 - 1,0,0]) 
           multmatrix([
            [1,0,1,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
           ])
           cylinder(h = enclosure_z_offs + 12 + 1, r1 = 15, r2=10);
           
           translate([- enclosure_l/2 + enclosure_x_offs ,0,0]) 
           cylinder(h = enclosure_z_offs + 12 + 1, r1 = 0, r2=10);

        }
            
        //interior of base
        translate([0,0,3])
        linear_extrude(12)
        square([base_l-2*wall_t , base_w-2*wall_t], center=true);
        
        //interior space
        hull() {
            translate([0,0,12])
            linear_extrude(1)
            square([base_l-2*wall_t, base_w-2*wall_t], center=true);
            
            translate([enclosure_x_offs, 0, enclosure_z_offs + 12])
            linear_extrude(1)
            square([enclosure_l-2*wall_t, enclosure_w-2*wall_t], center=true);
             
            translate([enclosure_x_offs, 0, enclosure_z_offs + 12 + 1])
            linear_extrude(1)
            square([enclosure_l-2*wall_t, enclosure_w-2*wall_t], center=true);
        }
        
        //bottom screw hole
        translate([-base_l/2 + base_screw_y_offs, 0])
        cylinder(r=base_screw_d/2+xy_tol, h = 15, $fn=16, center = true);
       
    }
    
    //board mounts
    intersection() {
        union()
        translate([enclosure_x_offs,0,0]) {
            translate([-enclosure_l/2, -enclosure_w/2, enclosure_z_offs + 12 + 1 ])
            corner_support();
            
            translate([-enclosure_l/2, enclosure_w/2, enclosure_z_offs + 12 + 1 ])
            mirror([0,1,0])
            corner_support();
            
            translate([enclosure_l/2, -enclosure_w/2, enclosure_z_offs + 12 + 1 ])
            rotate(90)
            corner_support();
            
            translate([enclosure_l/2, enclosure_w/2, enclosure_z_offs + 12 + 1 ])
            mirror([0,1,0])
            rotate(90)
            corner_support();
        }
        hull() {
            translate([0,0,12])
            linear_extrude(1)
            square([base_l, base_w], center=true);
            
            
            translate([enclosure_x_offs, 0, enclosure_z_offs + 12])
            linear_extrude(1)
            square([enclosure_l, enclosure_w], center=true);
        }
   }
   }
   
    for(xy = perf_board_holes)
        translate([0,0,enclosure_z_offs + 13 - nut_h - xy_tol - wall_t])
        translate(xy + [enclosure_x_offs, 0])
        nut_negative();
   
    for(x=[-enclosure_l/2 - 3,enclosure_l/2 + 3])
    translate([x + enclosure_x_offs,0,enclosure_z_offs + 13 - nut_h - xy_tol - wall_t])
    nut_negative();
}
    
}

//corner_support();

module corner_support() {
    /*
    translate([0,0,-14])
    hull() {
        cube([1,1,1]);
        
        translate([0,0,12])
        cube([15,15,2]);
        
    }
    */
    translate([0,0,-15])
    hull() {
        
    cube([15,1,1]);
    
    translate([0,0,13])
        cube([15,15,2]);
    }
    
}

//board();
module board() {
    color("SaddleBrown")
    linear_extrude(perf_board_t)
    difference() {
        square(size=[perf_board_l, perf_board_w],center=true);
        
        for(xy = perf_board_holes)
        translate(xy)
        circle(r=perf_board_hole_d/2,$fn=16);
        
    }
    
}


power_board_bottom();
module power_board_bottom() {
    
    difference() {
        union() {
            rotate([90,0,0])
            linear_extrude(perf_board_w,center=true)
            polygon([
                [-perf_board_l/2,0],
                [-15,0],
                [-15,8],
                [15,8],
                [15,0],
                [perf_board_l/2,0],
                [perf_board_l/2,12],
                [-perf_board_l/2,12],
            ]);
            
            for(xy = perf_board_holes)
            translate(xy)
            cylinder(r=perf_board_hole_d/2 + wall_t,h=17,$fn=16);
        }
        
        for(xy = perf_board_holes)
        translate(xy)
        cylinder(r=perf_board_hole_d/2+xy_tol,h=60,center=true,$fn=16);
    }
    
    
}


//spacer();

module spacer() {
    color("fuchsia")
    linear_extrude(25)
    difference() {
        circle(r=bolt_d/2+xy_tol+wall_t,$fn=16);
        circle(r=bolt_d/2+xy_tol,$fn=16); 
    }
}

