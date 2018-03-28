// if a sub category is selected
$('.list a').on('click', function() {
    const subCategory = $(this).text();
    switch (subCategory) {
        case 'Ancient monuments':
            // assign category to its parent category
            sessionStorage.setItem('chargeCategory', 'Other');
            // assign subcategory to its value
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // assign statProv if applicable
            // sessionStorage.setItem('statProv', '');
            // assign instrument if applicable
            // sessionStorage.setItem('instrument', '');
            // set the href of the link to the corresponding stat-prov page
            $(this).attr('href', 'confirm-ancient-monuments-stat-prov');
            break;
        case 'Approval under house in multiple occupation (HMO)':
            sessionStorage.setItem('chargeCategory', 'Housing');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', '');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Article 4':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Town and Country Planning (GPD) Order (Gdo) Article 4');
            sessionStorage.setItem('instrument', 'Direction');
            $(this).attr('href', 'confirm-stat-prov-1-2-non-express');
            break;
        case 'Assets of community value':
            sessionStorage.setItem('chargeCategory', 'Other');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Localism Act 2011, section 100(a)');
            sessionStorage.setItem('instrument', 'Added to the list of assets of community value');
            $(this).attr('href', 'confirm-stat-prov-1-2-1-mand');
            break;
        case 'Breach of conditions':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', '');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Change a development':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Town and Country Planning Act 1990 section 97');
            sessionStorage.setItem('instrument', 'Order');
            $(this).attr('href', 'confirm-stat-prov-1-2-non-express');
            break;
        case 'Compulsory purchase order':
            sessionStorage.setItem('chargeCategory', 'Other');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            sessionStorage.setItem('instrument', 'Order');
            $(this).attr('href', 'confirm-compulsory-purchase-order-stat-prov');
            break;
        case 'Conditional planning consent':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Town and Country Planning Act 1990 section 70');
            sessionStorage.setItem('instrument', 'Planning permission');
            $(this).attr('href', 'confirm-stat-prov-1-2-non-express');
            break;
        case 'Conservation area':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Planning (Listed Buildings and Conservation Areas) Act (1990), section 69(4)');
            sessionStorage.setItem('instrument', 'Notice');
            $(this).attr('href', 'confirm-stat-prov-1-2-1-mand');
            break;
        case 'Enforcement notice (planning)':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Town and Country Planning Act 1990 section 172');
            sessionStorage.setItem('instrument', 'Notice');
            $(this).attr('href', 'confirm-stat-prov-1-2-non-express');
            break;
        case 'Enforcement notice (listed building)':
            sessionStorage.setItem('chargeCategory', 'Listed building');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            sessionStorage.setItem('instrument', 'Notice');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Financial':
            sessionStorage.setItem('chargeCategory', 'Financial');
            // sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', 'Notice');
            $(this).attr('href', 'confirm-financial-charge-stat-prov');
            break;
        case 'Grant':
            sessionStorage.setItem('chargeCategory', 'Housing');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', 'Notice');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Improve a highway':
            sessionStorage.setItem('chargeCategory', 'Other');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', 'Notice');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Interim certificate under HMO':
            sessionStorage.setItem('chargeCategory', 'Housing');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', 'Notice');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Listed building':
            sessionStorage.setItem('chargeCategory', 'Listed building');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Planning (Listed Buildings and Conservation Areas) Act 1990, section 2(2)');
            sessionStorage.setItem('instrument', 'List');
            $(this).attr('href', 'confirm-stat-prov-1-2-1-mand');
            break;
        case 'Listed building conditional planning consent':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Planning (Listed Buildings and Conservation Areas) Act 1990 section 17');
            sessionStorage.setItem('instrument', 'Consent');
            $(this).attr('href', 'confirm-stat-prov-1-2-non-express');
            break;
        case 'Notice of works or repairs':
            sessionStorage.setItem('chargeCategory', 'Housing');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', '');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Planning agreement':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Town and Country Planning Act 1990 Part III Control over Development section 106');
            sessionStorage.setItem('instrument', 'Agreement');
            $(this).attr('href', 'confirm-stat-prov-1-2-1-mand');
            break;
        case 'Planning notices':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', '');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Re-approval of grant':
            sessionStorage.setItem('chargeCategory', 'Housing');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', '');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Re-approval under HMO':
            sessionStorage.setItem('chargeCategory', 'Housing');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', '');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Repairs notice':
            sessionStorage.setItem('chargeCategory', 'Listed building');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', '');
            $(this).attr('href', 'confirm-stat-prov-1-2-many-non-mand');
            break;
        case 'Smoke control order':
            sessionStorage.setItem('chargeCategory', 'Other');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Clean Air Act 1993, section 18');
            sessionStorage.setItem('instrument', 'Order');
            $(this).attr('href', 'confirm-stat-prov-1-2-non-express');
            break;
        case 'Site of special scientific interest (SSSI)':
            sessionStorage.setItem('chargeCategory', 'Other');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            sessionStorage.setItem('statProv', 'Wildlife and Countryside Act 1981 Part II section 28');
            sessionStorage.setItem('instrument', 'Notice');
            $(this).attr('href', 'confirm-stat-prov-1-2-1-mand');
            break;
        case 'Tree preservation order (TPO)':
            sessionStorage.setItem('chargeCategory', 'Planning');
            sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            sessionStorage.setItem('instrument', 'Order');
            $(this).attr('href', 'confirm-stat-prov-tpo');
            break;
        case 'Land compensation':
            sessionStorage.setItem('chargeCategory', 'Land compensation');
            // sessionStorage.setItem('chargeSubcategory', subCategory);
            // sessionStorage.setItem('statProv', '');
            // sessionStorage.setItem('instrument', '');
            $(this).attr('href', 'land-compensation');
            break;
        default:
            $(this).attr('confirm-stat-prov-1-2-many-non-mand');
    }

})
    
    
    