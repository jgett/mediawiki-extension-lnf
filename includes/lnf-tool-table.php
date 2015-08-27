<table class="wikitable lnf-tool-table">
    <?php
    $lastLab = 0;
    $lastProcTech = 0;
    foreach($tools as $t){
        if ($t->LabID != $lastLab){
            $lastLab = $t->LabID;
            ?>
            <tr>
                <td class="lnf-lab"><?php echo $t->LabName; ?></td>
            </tr>
            <?php
        }
        
        if ($t->ProcessTechID != $lastProcTech){
            $lastProcTech = $t->ProcessTechID;
            ?>
            <tr>
                <td class="lnf-proc-tech"><?php echo $t->ProcessTechName; ?></td>
            </tr>
            <?php
        }
        ?>
        <tr>
            <td class="lnf-resource-name"><a href="<?php echo $t->WikiPageUrl; ?>"><?php echo $t->ResourceName; ?></a></td>
        </tr>
        <?php
    }
    ?>
</table>