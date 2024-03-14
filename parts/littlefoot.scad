

//apologies for this sloppy scad code. ~b


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



std_srvo_body_w = 20.33;
std_srvo_body_l = 40.78;
std_srvo_body_h = 38.04;
std_srvo_bracket_l = 55;
std_srvo_bracket_h = 2.9;
std_srvo_hole_a = 10.0;
std_srvo_hole_b = 49.5;
std_srvo_hole_d = 4;
std_srvo_bracket_z = 7.75;
std_srvo_shaft_offs = 10;
std_srvo_keepout_d = 13.5;
std_srvo_keepout_h = 2.25;



module std_servo() {
    color("DimGray")
    difference() {
        union() {
            translate([-std_srvo_shaft_offs, -std_srvo_body_w/2, -std_srvo_body_h])
            cube(size=[std_srvo_body_l,std_srvo_body_w,std_srvo_body_h]);
            
            translate([-std_srvo_shaft_offs - (std_srvo_bracket_l-std_srvo_body_l)/2, -std_srvo_body_w/2, -std_srvo_bracket_h-std_srvo_bracket_z])
            cube(size=[std_srvo_bracket_l,std_srvo_body_w,std_srvo_bracket_h]);
            
            cylinder(r=std_srvo_keepout_d/2, h=std_srvo_keepout_h);
        }
        
        translate([std_srvo_body_l/2 - std_srvo_shaft_offs,0,-std_srvo_bracket_z - 2*std_srvo_bracket_h])
        for(i=[std_srvo_hole_b/2,-std_srvo_hole_b/2])
        for(j=[std_srvo_hole_a/2,-std_srvo_hole_a/2])
        translate([i,j,0])
        cylinder(r=std_srvo_hole_d/2,h=3*std_srvo_bracket_h,$fn=16);
    }
}

std_srvo_flwr_outer_d = 31.6;
std_srvo_flwr_tip_d = 4.8;
std_srvo_flwr_cntr_d = 9;
std_srvo_flwr_t = 2;
std_srvo_flwr_h = 6;
std_srvo_flwr_hole_d1 = 27;
std_srvo_flwr_hole_d2 = 21;
std_srvo_flwr_hole_d3 = 15;
std_srvo_flwr_hole_r = 1.75 / 2;
std_srvo_flwr_shaft_r = 8.4 / 2;
std_srvo_flwr_shaft_r2 = 5.75 / 2;



module std_servo_flower() {

    color("Gainsboro")
    difference() {
    union() {
        translate([0,0,std_srvo_flwr_h-std_srvo_flwr_t])
        linear_extrude(std_srvo_flwr_t) 
        difference() {
            union() {
                for(j=[0,120,240])
                rotate(j)
                for(i=[0,180])
                hull() 
                {
                    rotate(i)
                    translate([std_srvo_flwr_outer_d/2 - std_srvo_flwr_tip_d/2,0,0])
                        circle(r=std_srvo_flwr_tip_d/2, $fn=16);
                    circle(r=std_srvo_flwr_cntr_d/2, $fn=32);
                }
            }
            
            for(j=[0:60:359])
            rotate(j)
            for(i=[std_srvo_flwr_hole_d1/2, std_srvo_flwr_hole_d2/2, std_srvo_flwr_hole_d3/2])
            translate([i,0,0])
            circle(r=std_srvo_flwr_hole_r , $fn=8);
        }
        
        cylinder(r=std_srvo_flwr_shaft_r,h=std_srvo_flwr_h,$fn=16);
    }
    
    translate([0,0,-std_srvo_flwr_h])
    cylinder(r=std_srvo_flwr_shaft_r2, h=std_srvo_flwr_h * 3,$fn=16);
    }

}


mro_srvo_body_w = 14;
mro_srvo_body_l = 29.4;
mro_srvo_body_h = 28;
mro_srvo_bracket_l = 39.75;
mro_srvo_bracket_h = 2.4;
mro_srvo_hole_a = 35;
mro_srvo_hole_d = 4;
mro_srvo_bracket_z = 7.7;
mro_srvo_shaft_offs = 6;
mro_srvo_keepout_d = 8.7;
mro_srvo_keepout_h = 3;


module micro_servo() {
    color("Gray")
    difference() {
        union() {
            translate([-mro_srvo_shaft_offs, -mro_srvo_body_w/2, -mro_srvo_body_h])
            cube(size=[mro_srvo_body_l,mro_srvo_body_w,mro_srvo_body_h]);

            translate([-mro_srvo_shaft_offs - (mro_srvo_bracket_l-mro_srvo_body_l)/2, -mro_srvo_body_w/2, -mro_srvo_bracket_h-mro_srvo_bracket_z])
            cube(size=[mro_srvo_bracket_l,mro_srvo_body_w,mro_srvo_bracket_h]);

            cylinder(r=mro_srvo_keepout_d/2, h=mro_srvo_keepout_h);
        }


        translate([mro_srvo_body_l/2 - mro_srvo_shaft_offs,0,-mro_srvo_bracket_z - 2*mro_srvo_bracket_h])
        for(i=[mro_srvo_hole_a/2,-mro_srvo_hole_a/2])
        translate([i,0,0])
        cylinder(r=mro_srvo_hole_d/2,h=3*mro_srvo_bracket_h,$fn=16);
    }          
}

mro_srvo_disk_r = 21/2;
mro_srvo_disk_t = 2;
mro_srvo_disk_h = 5.6;
mro_srvo_disk_hole_r = 1.5/2;
mro_srvo_disk_hole_a = 15;
mro_srvo_disk_hole_b = 7;
mro_srvo_disk_center_r = 9/2;
mro_srvo_disk_center_hole_r = 2;


module micro_servo_disk() {

    color("silver")
    difference() {
        union() {
            translate([0,0,mro_srvo_disk_h-mro_srvo_disk_t])
            linear_extrude(mro_srvo_disk_t)
            difference() {
                circle(r=mro_srvo_disk_r, $fn = 16);

                for(j=[0,90,180,270])
                for(i=[-mro_srvo_disk_hole_b/2,0,mro_srvo_disk_hole_b/2])
                rotate(j)
                translate([mro_srvo_disk_hole_a/2, i])
                circle(r=mro_srvo_disk_hole_r, $fn=8);
            }
            
            cylinder(r=mro_srvo_disk_center_r,h=mro_srvo_disk_h,$fn=16);
        }
        
        translate([0,0,-mro_srvo_disk_h])
        cylinder(r=mro_srvo_disk_center_hole_r,h=mro_srvo_disk_h*3,$fn=16);
    }

}

rpi_cam_2_board_w = 25;
rpi_cam_2_board_h = 23.862;
rpi_cam_2_board_t = 1;
rpi_cam_2_board_corner_r = 2.0;
rpi_cam_2_board_hole_r = 1.1;
rpi_cam_2_board_hole_a = 2;
rpi_cam_2_board_hole_b = 2;
rpi_cam_2_board_hole_c = 14.5;
rpi_cam_2_sensor_wl = 8.5;
rpi_cam_2_sensor_h = 5.75;
rpi_cam_2_bottom_sensor_offs = 9.462;
rpi_cam_2_connector_w = 22;
rpi_cam_2_connector_h = 5.6;
rpi_cam_2_connector_t = 2.75;



module rpi_cam_2() {
    
    color("OliveDrab")
    linear_extrude(rpi_cam_2_board_t)
    difference() {
        hull() {
            for(i=[rpi_cam_2_board_w/2 - rpi_cam_2_board_corner_r, -rpi_cam_2_board_w/2 + rpi_cam_2_board_corner_r])
            for(j=[- rpi_cam_2_board_corner_r, -rpi_cam_2_board_h + rpi_cam_2_board_corner_r])
            translate([i,j,0])
            circle(r=rpi_cam_2_board_corner_r, $fn=16);
        }
    
        for(i=[rpi_cam_2_board_w/2 - rpi_cam_2_board_hole_a, -rpi_cam_2_board_w/2 + rpi_cam_2_board_hole_a])
        for(j=[-rpi_cam_2_board_hole_b, -rpi_cam_2_board_hole_c])
        translate([i,j,0])
        circle(r=rpi_cam_2_board_hole_r, $fn=16);
    }
    
    color("DarkSlateGray")
    translate([-rpi_cam_2_sensor_wl/2,-rpi_cam_2_sensor_wl/2 - rpi_cam_2_board_h + rpi_cam_2_bottom_sensor_offs ,rpi_cam_2_board_t])
    cube(size=[rpi_cam_2_sensor_wl,rpi_cam_2_sensor_wl,rpi_cam_2_sensor_h]);

    color("LightSlateGray") 
    translate([-rpi_cam_2_connector_w/2,-rpi_cam_2_board_h,-rpi_cam_2_connector_t])
    cube([rpi_cam_2_connector_w,rpi_cam_2_connector_h,rpi_cam_2_connector_t]);
}


pt_srvo_displacement = [0,-15,45];
pt_srvo_rotation = [90,90,0];

cam_displacement = [20,12,pt_srvo_displacement[1]];
cam_rotation = [0,-90,-90];


cam_brck_corner_r = 2;
cam_brck_t = 2;
cam_brck_h = mro_srvo_body_h + xy_tol + cam_brck_t;
cam_brck_pad_d = 5;

cam_brck_nbbn_r1 = 5;
cam_brck_nbbn_r2 = 0.5;
cam_brck_nbbn_h = 4;


//camera_bracket();

module camera_bracket() {

color("purple")
    union() {
    difference() {
    translate([0,0,-cam_brck_h])
    linear_extrude(cam_brck_h)
    translate([-mro_srvo_shaft_offs - (mro_srvo_bracket_l - mro_srvo_body_l) / 2 + cam_brck_corner_r,-mro_srvo_body_w/2 + cam_brck_corner_r])
    minkowski() {
        square(size=[mro_srvo_bracket_l - 2*cam_brck_corner_r, mro_srvo_body_w  - 2*cam_brck_corner_r + cam_brck_t] );
        circle(r=cam_brck_corner_r,$fn=4);
    }
    
    translate([-mro_srvo_shaft_offs-xy_tol,-mro_srvo_body_w/2-xy_tol,-mro_srvo_body_h-xy_tol])
    cube(size=[mro_srvo_body_l+2*xy_tol, mro_srvo_body_w+2*xy_tol, mro_srvo_body_h+2*xy_tol]);
    
    translate([-mro_srvo_shaft_offs - (mro_srvo_bracket_l - mro_srvo_body_l) / 2-xy_tol,-mro_srvo_body_w/2 - xy_tol,-mro_srvo_bracket_z-mro_srvo_bracket_h-xy_tol])
        cube(size=[mro_srvo_bracket_l + 2*xy_tol,mro_srvo_body_w+2*xy_tol,mro_srvo_bracket_h+2*xy_tol + 10]);
    
        for(i=[-mro_srvo_hole_a/2,mro_srvo_hole_a/2])
    translate([i + mro_srvo_body_l/2 - mro_srvo_shaft_offs  ,0, -14.5])
    nut_negative_2();
    
        translate([-15,-10,7-mro_srvo_body_h-2.5])
    cube([10,15,5]);

    }
    
    translate(cam_displacement)
    rotate(cam_rotation)
    translate([0,0,-4])
    linear_extrude(5)
    difference() {
        hull() {
            for(i=[rpi_cam_2_board_w/2, -rpi_cam_2_board_w/2])
            for(j=[0, -rpi_cam_2_board_h])
            translate([i,j,0])
            circle(r=rpi_cam_2_board_corner_r, $fn=16);
        }
        
         hull() {
            for(i=[rpi_cam_2_board_w/2 - rpi_cam_2_board_corner_r, -rpi_cam_2_board_w/2 + rpi_cam_2_board_corner_r])
            for(j=[- rpi_cam_2_board_corner_r, -rpi_cam_2_board_h + rpi_cam_2_board_corner_r - 10])
            translate([i,j,0])
            circle(r=rpi_cam_2_board_corner_r + xy_tol, $fn=16);
        }
    }
    
    translate(cam_displacement)
    rotate(cam_rotation)  
    translate([0,0,-4])
    linear_extrude(4) 
    difference() {
    union() {
        for(i=[rpi_cam_2_board_w/2 - rpi_cam_2_board_hole_a, -rpi_cam_2_board_w/2 + rpi_cam_2_board_hole_a])
        for(j=[-rpi_cam_2_board_hole_b, -rpi_cam_2_board_hole_c])
        translate([i,j,0])
        circle(r=cam_brck_pad_d/2, $fn=16);
    }
    for(i=[rpi_cam_2_board_w/2 - rpi_cam_2_board_hole_a, -rpi_cam_2_board_w/2 + rpi_cam_2_board_hole_a])
        for(j=[-rpi_cam_2_board_hole_b, -rpi_cam_2_board_hole_c])
        translate([i,j,0])
        circle(r=rpi_cam_2_board_hole_r, $fn=16);
    }

    translate([0,0,-mro_srvo_body_h-cam_brck_nbbn_h-cam_brck_t-0.1])
    cylinder(r1=cam_brck_nbbn_r2, r2=cam_brck_nbbn_r1+0.1, h=cam_brck_nbbn_h, $fn=64);
    }

}

module nut_negative_2() {

    translate([-xy_tol-nut_w/2,-nut_r-xy_tol,-xy_tol])
    cube([nut_w+2*xy_tol, nut_r*2+2*xy_tol, nut_h+2*xy_tol]);

    translate([0,0,1])
    rotate(22.5)
    cylinder(r=(bolt_d/2+xy_tol)/cos(22.5), h=19, center=true, $fn=8);
    
}

pt_bracket_r1 = 29;
pt_bracket_w1 = 50;
pt_bracket_dz = 50;
pt_bracket_w2 = 33;
pt_bracket_base_t = 7;
pt_bracket_base_zposn = -5;
pt_bracket_mk_r = 1;

//pan_tilt_bracket();
module pan_tilt_bracket() {

    color("RebeccaPurple")
    difference() {
        minkowski() 
        {
            translate([0,0,pt_bracket_mk_r])
            difference() 
            {
                rotate(45/2)
                hull() {
                    linear_extrude(1)
                    circle(r=pt_bracket_r1-pt_bracket_mk_r,$fn=8);

                    translate([0,0,pt_bracket_dz])
                    cylinder(r1=pt_bracket_r1-pt_bracket_mk_r, r2=(pt_bracket_r1-pt_bracket_mk_r)*sqrt(2)/2, h=(pt_bracket_r1-pt_bracket_mk_r)/2, $fn=8);
                    
                }

                translate([-pt_bracket_w1,-pt_bracket_w2/2-pt_bracket_mk_r-0.9,pt_bracket_base_t-2*pt_bracket_mk_r])
                cube([2*pt_bracket_w1,pt_bracket_w2+2*pt_bracket_mk_r,pt_bracket_dz+pt_bracket_r1+2]);
            }
            
            sphere(r=pt_bracket_mk_r,$fn=8);
        }
        
        
        //flower shape
        translate([0,0,2.8])
        linear_extrude(pt_bracket_base_t)
        union() {
            for(j=[0,120,240])
            rotate(j)
            for(i=[0,180])
            hull() 
            {
                rotate(i)
                translate([std_srvo_flwr_outer_d/2 - std_srvo_flwr_tip_d/2,0,0])
                    circle(r=std_srvo_flwr_tip_d/2 + xy_tol, $fn=16);
                circle(r=std_srvo_flwr_cntr_d/2 + 2, $fn=32);
            }
        }
        
        //flower holes 
         linear_extrude(pt_bracket_base_t + 0.01)
        for(j=[0:60:359])
        rotate(j)
        for(i=[std_srvo_flwr_hole_d1/2, std_srvo_flwr_hole_d2/2, std_srvo_flwr_hole_d3/2])
        translate([i,0,0])
        circle(r=std_srvo_flwr_hole_r + xy_tol , $fn=16);
        
        //shaft 
        translate([0,0,-0.01])
        cylinder(r=std_srvo_flwr_shaft_r+xy_tol+1, h=pt_bracket_base_t + 0.01,$fn=32);
        
        //nubbin slot 
        translate(-[0,0,std_srvo_keepout_h  +  std_srvo_flwr_h + pt_bracket_base_zposn])
        translate(pt_srvo_displacement)
        rotate(pt_srvo_rotation) 
        hull() {
            translate([0,0,-mro_srvo_body_h-cam_brck_nbbn_h-cam_brck_t-0.1-xy_tol])
            cylinder(r1=cam_brck_nbbn_r2, r2=cam_brck_nbbn_r1+xy_tol+0.1, h=cam_brck_nbbn_h+xy_tol, $fn=64);
            
            translate([-pt_bracket_dz,0,-mro_srvo_body_h-cam_brck_nbbn_h-cam_brck_t-xy_tol-0.1])
            cylinder(r1=cam_brck_nbbn_r2, r2=cam_brck_nbbn_r1+xy_tol+0.1, h=cam_brck_nbbn_h+xy_tol, $fn=64);
        }
        
        //micro servo disk slot
        translate(-[0,0,std_srvo_keepout_h  +  std_srvo_flwr_h + pt_bracket_base_zposn])
        translate(pt_srvo_displacement)
        rotate(pt_srvo_rotation) 
        {
            hull()
            for(i=[0,-pt_bracket_dz])
            translate([i,0,-pt_bracket_r1/2])
            cylinder(r=mro_srvo_disk_center_r+xy_tol,h=pt_bracket_r1,$fn=32);
            
            
            hull()
            for(i=[0,-pt_bracket_dz])
            translate([i,0,mro_srvo_keepout_h])
            translate([0,0,mro_srvo_disk_h-mro_srvo_disk_t-xy_tol])
            cylinder(r=mro_srvo_disk_r+xy_tol, h=mro_srvo_disk_t+2*xy_tol, $fn = 32);
        }
        
        //micro servo disk holes
        translate(-[0,0,std_srvo_keepout_h  +  std_srvo_flwr_h + pt_bracket_base_zposn])
        translate(pt_srvo_displacement)
        rotate(pt_srvo_rotation) 
        translate([0,0,-pt_bracket_r1/2])
        linear_extrude(pt_bracket_r1)
        for(j=[0,90,180,270])
        for(i=[-mro_srvo_disk_hole_b/2,0,mro_srvo_disk_hole_b/2])
        rotate(j)
        translate([mro_srvo_disk_hole_a/2, i])
        rotate(45/2)
        circle(r=mro_srvo_disk_hole_r/cos(45/2) + xy_tol, $fn=8);
               
    }
    
   


    
}





pt_assembly(tilt = -70);
module pt_assembly(tilt = 0) {


std_servo();

translate([0,0,std_srvo_keepout_h])
std_servo_flower();

translate([0,0,std_srvo_keepout_h  +  std_srvo_flwr_h + pt_bracket_base_zposn])
pan_tilt_bracket();



translate(pt_srvo_displacement)
rotate(pt_srvo_rotation) 
{

    translate([0,0,mro_srvo_keepout_h])
    micro_servo_disk();

    rotate(tilt + 90) {    
        micro_servo();
        
        camera_bracket();

        translate(cam_displacement)
        rotate(cam_rotation)
        rpi_cam_2();
    }

}




}



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
    
    translate([95,0,70])
    pt_assembly(tilt = -70);
    
    translate([-125,0,40])
    rotate([180,0,90])
    power_board_bottom();
    
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
    
color("Magenta")  
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

//spacer();

module spacer() {
    color("fuchsia")
    linear_extrude(25)
    difference() {
        circle(r=bolt_d/2+xy_tol+wall_t,$fn=16);
        circle(r=bolt_d/2+xy_tol,$fn=16); 
    }
}




//power_board_bottom();
module power_board_bottom() {
    color("MediumOrchid")
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

